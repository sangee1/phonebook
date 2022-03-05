import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Person = ({ person }) => {
  return (
    <div>
      <li>
        {person.name} {person.number}
      </li>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addName = (event) => {
    event.preventDefault();
    console.log({ newName });
    //console.log(persons);
    const arr = persons.map((p) => p.name);
    console.log(arr);
    console.log(arr.includes(newName));
    if (arr.includes(newName)) {
      return (
        <div>{window.alert(`${newName} is already found in Phonebook`)}</div>
      );
    }
    const nameObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(nameObject));
    setNewName("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    //const sName = event.target.value;
    setShowAll(false);
    setSearchName(event.target.value);
    //persons.filter((p) => p.name.startsWith(sName));
  };

  const notesToShow = showAll
    ? persons
    : persons.filter((p) =>
        p.name.toLowerCase().startsWith(searchName.toLowerCase())
      );

  return (
    <div>
      <h2>PhoneBook</h2>
      <h4>Filter shown with</h4>
      <input type="search" onChange={handleSearch} />
      <h4>Add new</h4>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {notesToShow.map((person) => (
          <Person key={person.id} person={person} />
        ))}
      </ul>
    </div>
  );
};

export default App;
