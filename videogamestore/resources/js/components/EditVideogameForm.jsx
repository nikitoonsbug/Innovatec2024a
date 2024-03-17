import { useState, useEffect, useContext } from "react";
import { MyContext } from "../Context";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function EditVideogameForm(props) {
  const [validated, setValidated] = useState(false);
  const { token } = useContext(MyContext);
  const navigate = useNavigate();
  const id = props.id
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedAuthor, setEditedAuthor] = useState(props.author);
  const [editedIsbn, setEditedIsbn] = useState(props.isbn);
  const [editedPublication_year, setEditedPublication_year] = useState(props.publication_year);
  const [editedAvailable_copies, setEditedAvailable_copies] = useState(props.available_copies);
  const [editedEditorial, setEditedEditorial] = useState(props.editorial);
  const [editedEdition, setEditedEdition] = useState(props.edition);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(props.id_category);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/Proyecto_biblioteca/public/api/category_index", {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);


  const handleEdit = () => {
    const form = document.getElementById("editBookForm");
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    if (editedAvailable_copies < 0) {
      setErrorMessages(['The number of copies cannot be negative.']);
      return;
    }
    const currentYear = new Date().getFullYear();
    if (parseInt(editedPublication_year, 10) > currentYear) {
      setErrorMessages(['Publication year cannot be greater than the current year.']);
      return;
    }
    if (parseInt(editedEdition, 10) < 1) {
      setErrorMessages(['Edition must be a positive number greater than or equal to 1.']);
      return;
    }


    const updatedBook = {
      id: id,
      title: editedTitle,
      author: editedAuthor,
      isbn: editedIsbn,
      publication_year: editedPublication_year,
      available_copies: editedAvailable_copies,
      editorial: editedEditorial,
      edition: editedEdition,
      id_category: selectedCategory,
    };
    axios.post("http://localhost/Proyecto_biblioteca/public/api/book_update",
      updatedBook,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }
    ).then(response => {
      console.log('response');
      console.log(response);
      props.updateComponent();
      navigate("/Proyecto_biblioteca/public/ListCards");
    }).catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessageString = error.response.data.error;
        const errorMessagesArray = errorMessageString.split('\n').filter((line) => line.trim() !== '');

        setErrorMessages(errorMessagesArray);
      } else {
        setErrorMessages(['An error occurred while adding the book.']);
      }
    });

    props.onHide();
  };

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} id="editBookForm">
          {errorMessages.length > 0 && (
            <Alert variant="danger">
              {errorMessages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </Alert>
          )}
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              required
              defaultValue={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAuthor">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedAuthor}
              onChange={(e) => setEditedAuthor(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIsbn">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedIsbn}
              onChange={(e) => setEditedIsbn(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPublicationYear">
            <Form.Label>Publication year</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedPublication_year}
              onChange={(e) => setEditedPublication_year(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAvailableCopies">
            <Form.Label>Available Copies</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedAvailable_copies}
              onChange={(e) => setEditedAvailable_copies(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEditorial">
            <Form.Label>Editorial</Form.Label>
            <Form.Control
              type="text"
              value={editedEditorial}
              onChange={(e) => setEditedEditorial(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEdition">
            <Form.Label>Edition</Form.Label>
            <Form.Control
              type="text"
              required
              value={editedEdition}
              onChange={(e) => setEditedEdition(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedCategoryName(e.target.options[e.target.selectedCategoryName].text);
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditVideogameForm;
