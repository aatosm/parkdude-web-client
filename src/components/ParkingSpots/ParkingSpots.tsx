import React, {Component, ChangeEvent } from 'react';
import { AppState, Dispatch, ParkingSpot } from '../../store/types';
import { connect } from 'react-redux';
import Modal from '../Modal/Modal';

import checkIcon from './../../img/ic_check.svg';
import { getParkingSpots, deleteParkingSpot } from '../../store/actions/parkingSpotActions';

import './ParkingSpots.css';

interface SelectedRows {
  [key: string]: boolean;
}

interface OwnParkingSpotsProps {
  type?: string;
}
interface ReduxParkingSpotsProps {
  getParkingSpots: () => void;
  parkingSpots: ParkingSpot [];
  deleteParkingSpot: (id: string) => void;
}

type ParkingSpotsProps = OwnParkingSpotsProps & ReduxParkingSpotsProps;

interface ParkingspotSate {
  showAddSpotModal: boolean;
  showDeleteModal: boolean;
  selectedRows: SelectedRows; 
}

class Parkingspots extends Component<ParkingSpotsProps, ParkingspotSate> {

  state = {
    selectedRows: {} as SelectedRows,
    showAddSpotModal: false,
    showDeleteModal: false,

  };

  openAddSpotModal = () => {
    this.setState({showAddSpotModal: true});
  }

  closeAddSpotModal = () => {
    this.setState({showAddSpotModal: false});
  }

  openDeleteModal = () => {
    this.setState({showDeleteModal: true});
  }
  closeDeleteModal = () => {
    this.setState({showDeleteModal: false});
  }

  handleCheckBoxClick = (event: ChangeEvent<HTMLInputElement>) => {
   
    const value: string = event.target.value;
    const oldvalue = this.state.selectedRows[value];
    const newSelectedRows = {...this.state.selectedRows};

    if (typeof oldvalue === "undefined") {
     
      newSelectedRows[value] = true;
      this.setState({selectedRows: newSelectedRows});
      
    } else {
     
      newSelectedRows[value] = !newSelectedRows[value];
      this.setState({selectedRows: newSelectedRows});

    }
  }

  deleteParkingSpots = () => {
    this.closeDeleteModal();

    Object.keys(this.state.selectedRows).forEach(row => {
      this.props.deleteParkingSpot(row);
    });

  }

  componentDidMount() {
    this.props.getParkingSpots();
  }

  render() {
    const deleteObjectNumber: number = Object.keys(this.state.selectedRows).reduce((acc, row) => {
      if (this.state.selectedRows[row]) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    const addButton = <button id="parking-spots-add-user" className="button" onClick={this.openAddSpotModal}> Add parking spot</button>;
    const addSpotModal = this.state.showAddSpotModal ? <Modal close={this.closeAddSpotModal} type='addSpot' /> : null;
    const deleteModal = this.state.showDeleteModal 
      ? (
        <Modal 
          close={this.closeDeleteModal} 
          confirmDelete={this.deleteParkingSpots} 
          type='delete-spots' 
          deleteObjectNumber={deleteObjectNumber}
        /> 
      )
      : null;
    const deleteButton = (
      <button 
        id="parking-spots-delete-button" 
        className="button" 
        onClick={this.openDeleteModal}
      >
        Delete selected
      </button>
      );

    const tableHeader = (
      <tr>
        <th>{}</th>
        <th>Number</th>
        <th>Regular spot</th>
        <th>Owner</th>
      </tr>
    );

    console.log(this.props.parkingSpots);
    const content = this.props.parkingSpots.map(item => ( 

    <tr key={item.id}>
      <td><input type="checkbox" value={item.id} onChange={this.handleCheckBoxClick}/></td>
      <td>{item.name}</td>
      <td>{item.owner ? <img src={checkIcon} className="table-check" alt="check icon"/> : null}</td>
      <td>{item.owner}</td>
    </tr>

    ));     
    return (
      <div id="parking-spots">
              
        <div id="parking-spots-header-container" className="flex-row">
          <h2>Parking spots </h2>
          {addButton}
          
        </div>

        <div id="parking-spots-table-container">
          <table id="parking-spots-table">

            <thead>
              {tableHeader}
            </thead>

            <tbody>
              {content}
            </tbody>
                                  
          </table>
       
        </div>

        <div id="parking-spots-delete-button-container" className="flex-row">
         {deleteButton}
        </div>      
      
      {addSpotModal}
      {deleteModal}
      </div>
    );
  }
}

const mapState = (state: AppState) => {
  return {
    parkingSpots: state.parkingSpot.parkingSpotList,
  };
};

const MapDispatch = (dispatch: Dispatch) => {
  return {
    deleteParkingSpot: (id: string) => dispatch(deleteParkingSpot(id)),
    getParkingSpots: () => dispatch(getParkingSpots()),
    
  };
};
export default connect(mapState, MapDispatch)(Parkingspots);
