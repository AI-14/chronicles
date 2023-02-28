FROM python:3.8.4 

WORKDIR /backend

ENV PYTHONUNBUFFERED 1 

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver"]
