import React, { useState, useEffect, useContext } from 'react';
import { MyContext } from "../Context";
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddVideogameForm() {
  const navigate = useNavigate();
  const { token, id_rol } = useContext(MyContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    relaese_date: '',
    stock: '',
    physical: '',
    digital: '',
    id_category: '',
    id_platform: '',
    developer: '',
    publisher: '',
  });
  const [categories, setCategories] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost/videogamestore/public/api/category_index', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
        );
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }


    };

    const fetchPlatforms = async () => {
      try {
        const response = await axios.get(
          'http://localhost/videogamestore/public/api/platform_index', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
        );
        setPlatforms(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!token) {
      navigate("/videogamestore/public/login");
      console.log(token)
      return;
    }
    if (id_rol != 1) {
      navigate("/videogamestore/public/")
      console.log(id_rol)
    }


    fetchCategories();
    fetchPlatforms();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVideogame = async () => {
    const emptyFields = Object.keys(formData).filter(key => formData[key] === '');

    if (emptyFields.length > 0) {
      setErrorMessages(['Please fill in all fields.']);
      return;
    }
    if (parseInt(formData.stock, 10) < 0) {
      setErrorMessages(['The number of videogames in stock cannot be negative.']);
      return;
    }
  
    const currentYear = new Date().getFullYear();
    if (parseInt(formData.relaese_date, 10) > currentYear) {
      setErrorMessages(['Release date cannot be greater than the current year.']);
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost/videogamestore/public/api/game_store',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      console.log(response);
      navigate('/videogamestore/public/ListCards');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessageString = error.response.data.error;
        const errorMessagesArray = errorMessageString.split('\n').filter((line) => line.trim() !== '');

        setErrorMessages(errorMessagesArray);
      } else {
        setErrorMessages(['An error occurred while adding the videogame.']);
      }
    }
  };

  return (
    <Form>
      {errorMessages.length > 0 && (
        <Alert variant="danger">
          {errorMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </Alert>
      )}
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          required
          onChange={handleInputChange}
          placeholder="Enter name"
        />
      </Form.Group>

      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          required
          onChange={handleInputChange}
          placeholder="Enter description"
        />
      </Form.Group>

      <Form.Group controlId="formPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          required
          onChange={handleInputChange}
          placeholder="Enter price"
        />
      </Form.Group>

      <Form.Group controlId="formImage">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="text"
          name="image"
          value={formData.image}
          required
          onChange={handleInputChange}
          placeholder="Enter image"
        />
      </Form.Group>

      <Form.Group controlId="formRelaese_date">
        <Form.Label>Relaese date</Form.Label>
        <Form.Control
          type="number"
          name="relaese_date"
          value={formData.relaese_date}
          required
          onChange={handleInputChange}
          placeholder="Enter relaese date"
        />
      </Form.Group>

      <Form.Group controlId="formStock">
        <Form.Label>Stock</Form.Label>
        <Form.Control
          type="number"
          name="stock"
          value={formData.stock}
          required
          onChange={handleInputChange}
          placeholder="Enter stock"
        />
      </Form.Group>

      <Form.Group controlId="formCategory">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="id_category"
          value={formData.id_category}
          required
          onChange={handleInputChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category_name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formCategoryPlatform">
        <Form.Label>Platform</Form.Label>
        <Form.Control
          as="select"
          name="id_platform"
          value={formData.id_platform}
          required
          onChange={handleInputChange}
        >
          <option value="">Select a platform</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>
              {platform.platform_name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formDeveloper">
        <Form.Label>Developer</Form.Label>
        <Form.Control
          type="text"
          name="developer"
          value={formData.developer}
          required
          onChange={handleInputChange}
          placeholder="Enter developer"
        />
      </Form.Group>

      <Form.Group controlId="formPublisher">
        <Form.Label>Publisher</Form.Label>
        <Form.Control
          type="text"
          name="publisher"
          value={formData.publisher}
          required
          onChange={handleInputChange}
          placeholder="Enter publisher"
        />
      </Form.Group>
  
      <Button variant="primary" onClick={handleAddVideogame}>
        Add Videogame
      </Button>
    </Form>
  );
}

export default AddVideogameForm;

