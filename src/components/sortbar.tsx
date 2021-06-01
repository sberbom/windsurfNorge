import React from 'react';
import {DropdownButton, InputGroup, FormControl, Button, Dropdown} from 'react-bootstrap'
import '../styles/sortbar.css'

interface IProps {
    onSearchWordChange: (event: any) => any;
    onSortbyChange: (sort: string) => any;
}

const Sortbar = ({onSearchWordChange, onSortbyChange}: IProps) => {


    return(
        <div className="sortbar-container">
            <DropdownButton id="dropdown-basic-button" title="Sorter etter">
                <Dropdown.Item onClick={() => onSortbyChange("Newest")}>Nyeste</Dropdown.Item>
                <Dropdown.Item onClick={() => onSortbyChange("Alphabetical")}>Alfabetisk</Dropdown.Item>
                <Dropdown.Item onClick={() => onSortbyChange("Most popular")}>Mestpopulære</Dropdown.Item>
                <Dropdown.Item onClick={() => onSortbyChange("Rating")}>Rating</Dropdown.Item>
            </DropdownButton>
            <InputGroup className="mb-3 searchfield">
                <FormControl
                    placeholder="Spot"
                    onChange={(event) => onSearchWordChange(event.target.value)}
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary">Søk</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default Sortbar;