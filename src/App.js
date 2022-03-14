import "./App.css";
import { useEffect, useState } from "react";
import personService from "./services/persons";

//test commentt
const Person = ({ person, handleDelete }) => {
  return (
    <div>
      <li>
        {person.name} {person.number}
        <button onClick={() => handleDelete(person.id)}>Delete</button>
      </li>
    </div>
  );
};

const Notification = ({ message }) => {
  if (message == null) {
    return null;
  }

  return <div className="notif">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((response) => {
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
      //existing entry
      //update the number
      //axios put
      const person = persons.find((p) => p.name === newName);
      const updatedPerson = { ...person, number: newNumber };
      const idChanged = person.id;
      personService.updatePerson(idChanged, updatedPerson).then((response) => {
        setPersons(
          persons.map((person) =>
            person.id !== idChanged ? person : response.data
          )
        );
      });
    } else {
      const nameObject = {
        //id: persons.length + 1,
        name: newName,
        number: newNumber,
      };
      //setPersons(persons.concat(nameObject));
      personService.createPerson(nameObject).then((response) => {
        setPersons(persons.concat(response.data));
        setNotifMessage(`Added ${newName} `);
        setTimeout(() => {
          setNotifMessage("");
        }, 5000);
        setNewName("");
      });
    }
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

  const handleDelete = (id) => {
    const person = persons.find((person) => person.id === id);
    personService
      .deletePerson(id)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        setNotifMessage(
          `Information of ${person.name} has been deleted from server `
        );
      });
    setPersons(persons.filter((person) => person.id !== id));
  };

  const notesToShow = showAll
    ? persons
    : persons.filter((p) =>
        p.name.toLowerCase().startsWith(searchName.toLowerCase())
      );

  return (
    <div>
      <h2>PhoneBook</h2>
      <Notification message={notifMessage} />
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
          <Person key={person.id} person={person} handleDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
};

export default App;
