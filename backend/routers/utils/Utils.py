from passlib.context import CryptContext
import pdfplumber
import re
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from docx import Document as DocxDocument

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def preprocess_document(file_obj, filename):
    """
    Extracts text and metadata from PDF, DOCX, or TXT file-like object, chunks the text, and returns a list of dicts with 'page_content' and 'metadata'.
    """
    ext = os.path.splitext(filename)[1].lower()
    full_text = ""
    title = filename
    author = None
    abstract = None
    keywords = None
    pub_date = None
    if ext == ".pdf":
        with pdfplumber.open(file_obj) as pdf:
            full_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        lines = full_text.split("\n")
        title = lines[0][:200] if lines else filename
        # Try to find author (look for 'Author' or byline in first 20 lines)
        for line in lines[1:20]:
            if re.search(r"author", line, re.IGNORECASE):
                author = line.strip()
                break
        # Try to find abstract (look for 'Abstract' section)
        abstract_match = re.search(r"abstract[:\s]*([\s\S]+?)(?:\n\s*keywords|\n\s*index terms|\n\s*[A-Z][a-z]+:|\n\s*1\.|\n\s*I\.|\n\s*$)", full_text, re.IGNORECASE)
        if abstract_match:
            abstract = abstract_match.group(1).strip()
        # Try to find keywords
        keywords_match = re.search(r"keywords?[:\s]*([\w,;\- ]+)", full_text, re.IGNORECASE)
        if keywords_match:
            keywords = keywords_match.group(1).strip()
        # Try to find publication date (look for yyyy or yyyy-mm-dd)
        pub_date_match = re.search(r"(19|20)\d{2}(-\d{2}-\d{2})?", full_text)
        if pub_date_match:
            pub_date = pub_date_match.group(0)
    elif ext == ".docx":
        doc = DocxDocument(file_obj)
        full_text = "\n".join([para.text for para in doc.paragraphs])
        props = doc.core_properties
        title = props.title or filename
        author = props.author
        # No standard for abstract/keywords in docx, but try to find in first 40 lines
        lines = full_text.split("\n")
        for line in lines[:40]:
            if not abstract and re.search(r"abstract", line, re.IGNORECASE):
                abstract = line.strip()
            if not keywords and re.search(r"keywords?", line, re.IGNORECASE):
                keywords = line.strip()
        # Try to find publication date
        pub_date_match = re.search(r"(19|20)\d{2}(-\d{2}-\d{2})?", full_text)
        if pub_date_match:
            pub_date = pub_date_match.group(0)
    elif ext == ".txt":
        full_text = file_obj.read().decode("utf-8")
        lines = full_text.split("\n")
        title = lines[0][:200] if lines else filename
        # Try to find author, abstract, keywords, pub_date in first 40 lines
        for line in lines[:40]:
            if not author and re.search(r"author", line, re.IGNORECASE):
                author = line.strip()
            if not abstract and re.search(r"abstract", line, re.IGNORECASE):
                abstract = line.strip()
            if not keywords and re.search(r"keywords?", line, re.IGNORECASE):
                keywords = line.strip()
        pub_date_match = re.search(r"(19|20)\d{2}(-\d{2}-\d{2})?", full_text)
        if pub_date_match:
            pub_date = pub_date_match.group(0)
    else:
        raise ValueError("Unsupported file type. Only PDF, DOCX, and TXT are supported.")
    if not full_text.strip():
        raise ValueError("No extractable text found in file.")
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(full_text)
    documents = []
    for i, chunk in enumerate(chunks):
        metadata = {"title": title, "section": f"chunk_{i+1}", "filename": filename}
        if author:
            metadata["author"] = author
        if abstract:
            metadata["abstract"] = abstract
        if keywords:
            metadata["keywords"] = keywords
        if pub_date:
            metadata["publication_date"] = pub_date
        documents.append({"page_content": chunk, "metadata": metadata})
    return documents