import React, {Component, ChangeEvent } from 'react';
import './TableView.css';
import Modal from '../Modal/Modal';
import { Redirect } from 'react-router-dom';
import { AppState, Dispatch } from '../../store/types';
import { connect } from 'react-redux';
import { ParkingSpot, IPerson, CreateParkingSpotData} from '../../store/types';
import { getParkingSpots, createParkingSpot, deleteParkingSpot} from '../../store/actions/parkingSpotActions';
import { getPersons} from '../../store/actions/personsActions';

import checkIcon from './../../img/ic_check.svg';

interface StringMap { [key: string]: string; }

interface StringTMap<T> { [key: string]: T; }
interface StringAnyMap extends StringTMap<any> {}

interface OwnTableViewProps {
  type?: string;
  
}

interface ReduxTableViewProps {
  parkingSpots: ParkingSpot [];
  persons: IPerson [];
  getParkingSpots: () => void;
  getPersons: () => void;
  createParkingSpot: (data: CreateParkingSpotData) => void;
  deleteParkingSpot: (id: string) => void;
}
interface SelectedRows {
  [key: string]: boolean;
}

interface TableViewState {
  showDeleteModal: boolean;
  showAddUserModal: boolean;
  showAddSpotModal: boolean;
  employeeSelected: number;
  selectedRows: SelectedRows; 
}

// type SelectedRows = { [key: string]: number; };

type TableViewProps = OwnTableViewProps & ReduxTableViewProps;

class TableView  extends Component<TableViewProps, TableViewState> {

  state = {

    employeeSelected: 0,
    selectedRows: {} as SelectedRows,
    showAddSpotModal: false,
    showAddUserModal: false,  
    showDeleteModal: false,
     
  };

  openDeleteModal = () => {
    this.setState({showDeleteModal: true});
  }
  closeDeleteModal = () => {
    this.setState({showDeleteModal: false});
  }

  openAddUserModal = () => {
    this.setState({showAddUserModal: true});
  }

  closeAdduserModal = () => {
    this.setState({showAddUserModal: false});
  }
  openAddSpotModal = () => {
    this.setState({showAddSpotModal: true});
  }

  closeAddSpotModal = () => {
    this.setState({showAddSpotModal: false});
  }

  renderRedirect = () => {
    if (this.state.employeeSelected !== 0) {
      console.log('seex');
      return  <Redirect to='/employees/1'/>;
      
    }
  } 

  setEmployeeSelected = () => {
    this.setState({employeeSelected: 1});
   
  }

  deletePersons = () => {
    console.log('delete');
  }

  deleteSpots = () => {
    console.log('delete');
  }

  handleCheckBoxClick = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const value: string = event.target.value;
    console.log(this.state.selectedRows);

    const oldvalue = this.state.selectedRows[value];
    console.log(oldvalue);
    const newSelectedRows = {...this.state.selectedRows};
    if (typeof oldvalue === "undefined") {
      console.log('lisätääb uusi');
      newSelectedRows[value] = true;
      this.setState({selectedRows: newSelectedRows});
      console.log(this.state.selectedRows);

    } else {
      console.log('muokataan vanahaa');
      newSelectedRows[value] = !newSelectedRows[value];
      this.setState({selectedRows: newSelectedRows});

    }

    console.log(this.state.selectedRows);
    console.log('lopussa');
  }

  componentDidMount() {
    if (this.props.type === 'parking-spots') {
      this.props.getParkingSpots();
    } else if (this.props.type === 'employees' || this.props.type === 'customers') {
      this.props.getPersons();
    }
  }

  render() {

    const deleteObjectNumber: number = Object.keys(this.state.selectedRows).reduce((acc, row) => {
      if (this.state.selectedRows[row]) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const deleteModal = this.state.showDeleteModal 
      ? (
        <Modal 
          close={this.closeDeleteModal} 
          confirmDelete={this.deletePersons} 
          type='delete' 
          deleteObjectNumber={deleteObjectNumber}
        /> 
      )
      : null;
    const addUserModal = this.state.showAddUserModal ? <Modal close={this.closeAdduserModal} type='addUser' /> : null;
    const addSpotModal = this.state.showAddSpotModal ? <Modal close={this.closeAddSpotModal} type='addSpot' /> : null;

    let header;
    let tableHeader;
    let content;
    let addButton;
    let deleteButton;
    let searchReservations = null;

    if (this.props.type === 'employees') {

      header = 'Employees';
      addButton = <button id="table-view-add-user" className="button" onClick={this.openAddUserModal}> Add user</button>;
      deleteButton = <button id="table-view-delete-button" className="button" onClick={this.openDeleteModal}>Delete selected</button>;

      tableHeader = (
        <tr>
          <th>{}</th>
          <th>Name</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Parking spot</th>
          <th>Usage statistic</th>
        </tr>
      );

      content = this.props.persons.map((item) => {
        if ( item.email.includes('@innogiant')) {
          return (

            <tr key={item.id} onClick={this.setEmployeeSelected}>
              <td><input type="checkbox" value={item.id}/></td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.admin ? <img src={checkIcon} className="table-check" alt="check icon"/> : null}</td>
              <td>{item.parkingSpot}</td>
              <td>{item.reservationCount}</td>
            </tr>

          );
        } else {return null; }
      });
    
    } else if (this.props.type === 'customers') {

      header = 'Customers';
      addButton = <button id="table-view-add-user" className="button" onClick={this.openAddUserModal}> Add user</button>;
      deleteButton = <button id="table-view-delete-button" className="button" onClick={this.openDeleteModal}>Delete selected</button>;

      tableHeader = (
        <tr>
          <th>{}</th>
          <th>Approved</th>
          <th>Name</th>
          <th>Email</th>
          <th>Usage statistic</th>
        </tr>
      );
      console.log(this.props.persons);
      content = this.props.persons.map((item) => {
        if ( !item.email.includes('@innogiant')) {
          return (

            <tr key={item.id} onClick={this.setEmployeeSelected}>
              <td><input type="checkbox"/></td>
              <td>{<img src={checkIcon} className="table-check" alt="check icon"/>}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.reservationCount}</td>
            </tr>

          );
        } else {return null; }
      });

    }  else if (this.props.type === 'accept-users') {

      header = 'Accept users';
      addButton = null;
      deleteButton = <button id="table-view-accept-button" className="button" onClick={this.openDeleteModal}>Accept selected</button>;

      tableHeader = (
        <tr>
          <th>{}</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      );

      content = this.props.persons.map((item) => {
        if ( item.role === 'unverified') {
          return (

            <tr key={item.id}>
              <td><input type="checkbox"/></td>
              <td>{item.name}</td>
              <td>{item.email}</td>
            </tr>
  
          );
        } else {return null; }
       
      });

    }  else if (this.props.type === 'parking-spots') {

      header = 'Parking spots';
      addButton = <button id="table-view-add-user" className="button" onClick={this.openAddSpotModal}> Add parking spot</button>;
      deleteButton = <button id="table-view-delete-button" className="button" onClick={this.openDeleteModal}>Delete selected</button>;

      tableHeader = (
        <tr>
          <th>{}</th>
          <th>Number</th>
          <th>Regular spot</th>
          <th>Owner</th>
        </tr>
      );

      console.log(this.props.parkingSpots);
      content = this.props.parkingSpots.map((item, key) => ( 

      <tr key={item.id}>
        <td><input type="checkbox" value={item.name} onChange={this.handleCheckBoxClick}/></td>
        <td>{item.name}</td>
        <td>{item.owner ? <img src={checkIcon} className="table-check" alt="check icon"/> : null}</td>
        <td>{item.owner}</td>
      </tr>

      ));     
                 
    } else if (this.props.type === 'reservations') {
      searchReservations = (
        <div className="flex-column" id="search-reservation-container">
          <h3>Search reservations</h3>
          <div className="flex-row">
            <input className="table-input" type="text" placeholder="start day"/>
            <input className="table-input"  type="text" placeholder="end day"/>
            <input className="table-input"  type="text" placeholder="parking spot"/>
            <input className="table-input"  type="text" placeholder="user"/>
            <button className="button" id="table-search-reservations-button">Search</button>
          </div>
        </div>
      );

    }
   
    return(
      
      <div id="table-view">
        {this.renderRedirect()}
        {searchReservations}
        
        <div id="table-view-header-container" className="flex-row">
          <h2> {header}</h2>
          {addButton}
        </div>

        <div id="table-view-table-container">
          <table id="table-view-table">

            <thead>
              {tableHeader}
            </thead>

            <tbody>
              {content}
            </tbody>
                                  
          </table>
       
        </div>

        <div id="table-view-delete-button-container" className="flex-row">
         {deleteButton}
        </div>      

        {deleteModal}
        {addUserModal}
        {addSpotModal}
     
      </div>
    );
  
  }

}

const mapState = (state: AppState) => {

  return {
    parkingSpots: state.parkingSpot.parkingSpotList,
    persons: state.persons.personList,
   
  };
};

const mapDispatch = (dispatch: Dispatch) => {
  return {
    createParkingSpot: (data: CreateParkingSpotData) => dispatch(createParkingSpot(data)),
    deleteParkingSpot: (id: string) => dispatch(deleteParkingSpot(id)),  
    getParkingSpots: () => dispatch(getParkingSpots()),
    getPersons: () => dispatch(getPersons()),
    
  };
};

export default connect(mapState, mapDispatch)(TableView) ;
