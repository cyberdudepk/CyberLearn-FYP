from flask import Flask, request, jsonify
from flask_cors import CORS
from datasets import load_dataset
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

# Load the trained model
model_directory = "C:\\Users\\hp\\Desktop\\FYP\\Model\\trained_model"  # Adjust the path to your saved model directory
model = AutoModelForSequenceClassification.from_pretrained(model_directory)

# Define the tokenizer
model_name = 'microsoft/xtremedistil-l6-h256-uncased'
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load the dataset to retrieve available classes
dataset = load_dataset("kkotkar1/course-reviews")
class_labels = dataset["train"]["label"]

# Get unique class labels
unique_class_labels = set(class_labels)

print("Available Classes:")
for idx, label in enumerate(unique_class_labels):
    print(f"{idx + 1}: {label}")

@app.route('/process_comment', methods=['POST'])
def process_comment():
    data = request.json
    username = data.get('username')
    comment = data.get('comment')
    courseId = data.get('courseId')

    print("This is received from front-end : ",username , comment, courseId )

    # Tokenize the review
    tokenized_review = tokenizer(comment, padding="max_length", truncation=True, max_length=128, return_tensors="pt")

    # Forward pass through the model
    with torch.no_grad():
        output = model(**tokenized_review)

    # Get the predicted class
    rating = torch.argmax(output.logits).item()

    # Display predicted class
    print(f"Predicted Class: {rating}")

    return jsonify({
        'username': username,
        'courseId': courseId,
        'comment': comment,
        'rating': rating
    })

if __name__ == '__main__':
    app.run(debug=True)
