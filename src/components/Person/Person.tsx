import React, { Component } from 'react';

import './Person.css';

import check from './../../img/ic_check.svg';

class Person extends Component {
 
  render() {
    return (
      <div id="person" className="flex-column">
        <div className="flex-row" id="person-header-container">
          <h2>Kimmo Käyttäjä</h2>
         
        </div>

        <div className="flex-row" id="person-delete-button-container">
          <button className="button" id="person-delete-button">Delete user</button>
        </div>

        <div className="flex-row" id="person-content-wrapper">
          <div id="person-info-container">
            <div>
              <span className="bold"> Role: </span>
              <span>Employee</span>
            </div>
            <div>
              <span className="bold">Email: </span>
              <span>kimmo.kayttaja@gmail.com</span>
            </div>
            <div>
              <span className="bold">Session: </span>
               <img src={check} alt="check" className="person-check"/>
            </div>
            <div>
              <span className="bold">Admin: </span>
               <img src={check} alt="check" className="person-check"/>
            </div>
            <div>
              <span className="bold">Regular spot</span>
            </div>

          </div>

          <div className="flex-column" id="person-history-container">
            <span className="bold">Reservation history</span>
           
              <table className="person-table">
              <thead>
                <tr>
                 
                  <th>Date</th>
                  <th>Spot</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 
                  <td>1.1.2222</td>
                  <td>2</td>
                </tr>
                 <tr>
                  
                  <td>1.1.2222</td>
                  <td>2</td>
                </tr>
                 <tr>
          
                  <td>1.1.2222</td>
                  <td>2</td>
                </tr>

              </tbody>
            </table>
            
          </div>

          <div id="person-future-reservation-container" className="flex-column">
            <span className="bold">Future reservations</span>
            <table className="person-table">
              <thead>
                <tr>
                  <th>{}</th>
                  <th>Date</th>
                  <th>Spot</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 <td><input type="checkbox"/></td>
                  <td>1.1.2222</td>
                  <td>2</td>
                </tr>
                 <tr>
                  <td><input type="checkbox"/></td>
                  <td>1.1.2222</td>
                  <td>2</td>
                </tr>
                 <tr>
                   <td><input type="checkbox"/></td>
                  <td>1.1.2222</td>
                  <td>2</td>
                </tr>

              </tbody>
            </table>
            <button className="button person-button " id="person-free-selected-spots-button"> Free selected spots</button>
          </div>

        </div>
        <div id="person-button-contaier" className="flex-row">
          <button className="button person-button">Make admin</button>
          <button className="button person-button">Kill session</button>
          <button className="button person-button">Reserve regular spot</button>
          <button className="button person-button">Change password</button>
        </div>

      </div>
                
    );
  }
}

export default Person;
