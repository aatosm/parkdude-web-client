import React, { Component, ChangeEvent, ReactNode } from 'react';
import './Modal.css';
import { connect } from 'react-redux';
import {  Dispatch, CreateParkingSpotData, IPerson, ParkingSpot } from './../../store/types';
import {createParkingSpot, changeOwner, giveSpot} from './../../store/actions/parkingSpotActions';
import { FormControl, MenuItem, InputLabel, Select } from '@material-ui/core';
import { createPerson, changePassword } from '../../store/actions/personsActions';

interface OwnModalProps {

  close: () => void;
  type: string;
  deleteObjectNumber?: number;
  confirmDelete?: () => void;
  parkingSpots?: ParkingSpot [];
  persons?: IPerson [];
  spotId?: string;
  spotname?: string;
  personId?: string;
  personEmail?: string;

}

interface ReduxModalprops {
  createParkingSpot: (data: CreateParkingSpotData) => void;
  createPerson: (email: string, name: string, password: string) => void;
  changeOwner: (id: string, name: string, newOwner: string, type: string) => void;
  changePassword: (id: string, password: string) => void;
  giveSpot: (spotId: string, spotName: string, personId: string, personemail: string) => void;
}

type ModalProps = OwnModalProps & ReduxModalprops;

interface ModalState {
  spotNumberInput: string;
  selectedSpotOwner: string;
  nameInput: string;
  emailInput: string;
  password1Input: string;
  password2Input: string;
  errorMessage: string;
}

class Modal extends Component<ModalProps, ModalState> {

  state = {
    emailInput: '',
    errorMessage: '',
    nameInput: '',
    password1Input: '',
    password2Input: '',
    selectedSpotOwner: '',
    spotNumberInput: '',
    
  };

  handleSpotNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({spotNumberInput: event.target.value});
  }
  handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({nameInput: event.target.value});
  }
  handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({emailInput: event.target.value});
  }
  handlePassword1Change = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({password1Input: event.target.value});
  }
  handlePassword2Change = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({password2Input: event.target.value});
  }

  createNewSpot = () => {

    const ownerEmail = this.state.selectedSpotOwner !== '' ? this.state.selectedSpotOwner : undefined; 
   
    const data = {   
      name: this.state.spotNumberInput,
      ownerEmail,    
    };
    console.log(data);
    this.props.createParkingSpot(data);
    this.props.close();
  }

  changeOwner = () => {
    const owner = this.state.selectedSpotOwner === 'free' ? '' : this.state.selectedSpotOwner;

    this.props.changeOwner(this.props.spotId as string, this.props.spotname as string, owner, '');
    this.props.close();
  }
  changePassword = () => {
    const password1 = this.state.password1Input;
    const password2 = this.state.password2Input;
    const person = this.props.personId as string;

    if (password2 !== password1) {
      this.setState({errorMessage: "Passwords don't match"});
      return;
    }

    this.props.changePassword(person, password1);
    this.props.close();
  }
  createPerson = () => {
    const email = this.state.emailInput;
    const name = this.state.nameInput;
    const password1 = this.state.password1Input;

    if (!this.isPersonInputvalid()) {
      return;
    }
    this.props.createPerson(email, name, password1);
    this.props.close();

  }

  isPersonInputvalid = () => {
    const email = this.state.emailInput;
    const name = this.state.nameInput;
    const password1 = this.state.password1Input;
    const password2 = this.state.password2Input;

    return email !== '' && name !== '' && password1 !== '' && password1 === password2;
  }

  handleSpotOwnerChange = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => {

    const value: string = event.target.value as string;
    this.setState({selectedSpotOwner: value});
    console.log(value);
  }

  handleGiveSpot = (event: ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => {
    const value = event.target.value as string;
    this.setState({spotNumberInput: value});
    console.log(value);
  }

  giveSpot = () => {

    const spotSplit = this.state.spotNumberInput.split('&');
    const spotId = spotSplit[0];
    const spotName = spotSplit[1];

    this.props.giveSpot(spotId, spotName, this.props.personId as string, this.props.personEmail as string);
    this.props.close();
  }

  render() {

    let content;

    if (this.props.type.includes('delete') ) {
      let deleteObjec = '';

      if (this.props.type === 'delete-persons') {
        if (this.props.deleteObjectNumber === 1) {
          deleteObjec = 'user';
        } else {
          deleteObjec = 'users';
        }
      } else if (this.props.type === 'delete-spots') {
        if (this.props.deleteObjectNumber === 1) {
          deleteObjec = 'parking spot';
        } else {
          deleteObjec = 'parking spots';
        }
      }

      content = (

        <div className="flex-column-center modal-delete modal">
          <h3>Delete Users</h3>
          <p>Are you sure you want to permanently delete {this.props.deleteObjectNumber} {deleteObjec}?</p>

          <div className="modal-button-container">      
            <button className="button modal-cancel-button"  onClick={this.props.close}>Cancel</button>
            <button className="button delete-button" onClick={this.props.confirmDelete}>Yes</button>
          </div>

        </div>
        
      );
    } else if (this.props.type === 'addUser') {
      
      content = (

        <div className="flex-column-center modal-add-user modal">
          <h3 className="modal-add-user-header">Add user</h3>

          <input 
            type="text" 
            placeholder="Email" 
            value={this.state.emailInput} 
            onChange={this.handleEmailChange} 
            className="modal-input"
          />
          <input 
            type="text" 
            placeholder="Name" 
            value={this.state.nameInput} 
            onChange={this.handleNameChange} 
            className="modal-input"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={this.state.password1Input} 
            onChange={this.handlePassword1Change} 
            className="modal-input"
          />
          <input 
            type="password" 
            placeholder="Repeat password" 
            value={this.state.password2Input} 
            onChange={this.handlePassword2Change} 
            className="modal-input"
          />

          <div className="modal-add-user-button-container">      
            <button className="button modal-cancel-button" onClick={this.props.close}>Cancel</button>
            <button 
              className="button accept-button" 
              onClick={this.createPerson}
              title={this.isPersonInputvalid() ? "" : "All fields must be filled and passwords must match."}
              disabled={!this.isPersonInputvalid()}
            >
              Add
            </button>
          </div>

        </div>
      );
    } else if (this.props.type === 'addSpot') {

      const persons = (this.props.persons || []).map(person => <MenuItem key={person.id} value={person.email}>{person.name}</MenuItem>);
      console.log(persons);

      content = (
        
        <div  className="flex-column-center modal-add-spot modal">

          <h3>Create a new parking spot</h3>

          <input 
            type="text" 
            placeholder="Number" 
            className="modal-input" 
            onChange={this.handleSpotNumberChange} 
            value={this.state.spotNumberInput}
          />
          
          <FormControl >
            <InputLabel>Select owner</InputLabel>
            <Select className="modal-select" value={this.state.selectedSpotOwner} onChange={this.handleSpotOwnerChange}>
              {persons}
            </Select>
          </FormControl>

          <div className="modal-button-container">      
            <button className="button modal-cancel-button" onClick={this.props.close}>Cancel</button>
            <button 
              className="button accept-button" 
              disabled={!this.state.spotNumberInput}
              title={this.state.spotNumberInput ? "" : "Parking spot number is required"}
              onClick={this.createNewSpot}
            >
              Create
            </button>
          </div>

        </div>
      );
    } else if (this.props.type === 'changeOwner') {

      const persons = (this.props.persons || []).map(person => 
        <MenuItem key={person.id} value={person.email}>{person.name + ' (' + person.email + ')'}</MenuItem>);

      persons.unshift(<MenuItem key={12121212} value={'free'}>No owner (free spot)</MenuItem>);

      content = (
        <div className="flex-column-center modal-change-owner modal">
          <h3>Select a new owner</h3>

          <FormControl >
            <InputLabel>Select owner</InputLabel>
            <Select className="modal-select" value={this.state.selectedSpotOwner} onChange={this.handleSpotOwnerChange}>
              {persons}
            </Select>
          </FormControl>

          <div className="modal-button-container">      
            <button className="button modal-cancel-button" onClick={this.props.close}>Cancel</button>
            <button className="button accept-button" onClick={this.changeOwner}>Ok</button>
          </div>
        </div>
      );
    } else if (this.props.type === 'changePassword') {

      content = (

        <div className="flex-column-center modal-change-password modal">
          <h3 className="modal-add-user-header">Change user's password</h3>
       
          <input 
            type="password" 
            placeholder="Password" 
            value={this.state.password1Input} 
            onChange={this.handlePassword1Change} 
            className="modal-input"
          />
          <input 
            type="password" 
            placeholder="Repeat password" 
            value={this.state.password2Input} 
            onChange={this.handlePassword2Change} 
            className="modal-input"
          />
          <p className="modal-error-message bold">{this.state.errorMessage}</p>

          <div className="modal-add-user-button-container">      
            <button className="button modal-cancel-button" onClick={this.props.close}>Cancel</button>
            <button className="button modal-add-user-button" onClick={this.changePassword}>Change</button>
          </div>

        </div>
      );
    } else if (this.props.type === 'giveSpot') {

      console.log(this.props.parkingSpots);
      const parkingSpotList: JSX.Element [] = [];
      (this.props.parkingSpots || []).forEach(spot => {
        if (spot.owner === null) {
          parkingSpotList.push( <MenuItem key={spot.id} value={spot.id + '&' + spot.name}>{spot.name}</MenuItem>);
        }
      });

      if (parkingSpotList.length === 0) {
        parkingSpotList.push(<MenuItem key={12121212} value={'no-spots-free'}> No free spots</MenuItem>);
      }

      content = (
        <div className="flex-column-center modal-give-spot modal">
          <h3>Select a parking spot</h3>

          <FormControl >
            <InputLabel>Select parking spot</InputLabel>
            <Select className="modal-select" value={this.state.spotNumberInput} onChange={this.handleGiveSpot}>
              {parkingSpotList}
            </Select>
          </FormControl>

           <div className="modal-button-container">      
            <button className="button modal-cancel-button"  onClick={this.props.close}>Cancel</button>
            <button className="button accept-button" onClick={this.giveSpot}>Ok</button>
          </div>
        </div>
      );
  
    }

    return (
      <div className="modal-container">
        {content}
      </div>
    );
  }

}
const MapDispatch = (dispatch: Dispatch) => {
  return {
    changeOwner: (id: string, name: string, newOwner: string, type: string) => dispatch(changeOwner(id, name, newOwner, type)),
    changePassword: (id: string, password: string) => dispatch(changePassword(id, password)),
    createParkingSpot: (data: CreateParkingSpotData) => dispatch(createParkingSpot(data)),
    createPerson: (email: string, name: string, password: string) => dispatch(createPerson(email, name, password)),
    giveSpot: (spotId: string, spotName: string, personId: string, personemail: string) =>
      dispatch(giveSpot(spotId, spotName, personId, personemail)),
    
  };
};

export default connect(null, MapDispatch)(Modal);
