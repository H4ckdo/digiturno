//@ sourceMappingUR=/assets/js/pack.bundle.js.map
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Button from './Button.jsx';
import PopUp from './PopUp.jsx';
import Input from './Input.jsx';
import FormChangeIp from './FormChangeIp.jsx';
import ModuleList from './ModuleList.jsx';
import { validWord } from '../utils';
import '../../scss/components/Pack.scss';

/**
* Represent Pack componnent class
* @constructor
* @param {Object} props - properties inherited of React.Component
*/
export default class Pack extends React.Component {
  constructor(props) {
    super(props);
    this.childrens = {};
  }

  componentDidMount() {
    this.SADDRESS = window.localStorage;
    this.refs.loaderPopUp.modal.openPopUp();
    window.failPopUp = this.refs.failPopUp;
    window.loaderPopUp = this.refs.loaderPopUp;
    window.changeIpPopUp = this.refs.changeIpPopUp;
    window.wrongIpPopUp = this.refs.wrongIpPopUp;
    window.restartPackPopUp = this.refs.restartPackPopUp;
    window.moduleListPopUp = this.refs.moduleListPopUp;
  }

  findModules() {
    const SADDRESS = window.localStorage.getItem('SADDRESS');
    return (
      new Promise((resolve, reject) => {
        $.ajax({url: `http://${SADDRESS}:1337/modulos/showAll`}).done((response) => {
          resolve(response);
        })
        .fail(e => {
          console.log("fail request")
          reject(e);
        })
      })
    )
  }

  async requestToken(data) {
    try {
      this.childrens.loader.modal.openPopUp();
      let response = await this.create(this.childrens);      
      if(response.hasOwnProperty('success') && response.success === false && response.reason === "any online") {
        this.childrens.anyModulo.modal.openPopUp();        
      }
    } catch (e) {
      console.log('error ', e);
      this.childrens.loader.modal.closePopUp();
      this.childrens.anyModulo.modal.closePopUp();
      this.childrens.fail.modal.openPopUp();
    }
  }

  async requestModules() {
    try {
      let { data } = await this.findModules(this.childrens);
      this.refs['module-list'].setState({loading: false, data});
    } catch (e) {
      this.refs['module-list'].setState({loading: false, data: []});
    }
  }

  create(childrens) {
    return (
      new Promise((resolve, reject) => {
        let uid = new ShortUniqueId()
        let name = uid.randomUUID(4);
        client.post(`http://${SADDRESS}:1337/token/create`, { name }, (resData, jwRes) => {
        console.log('jwRes ', jwRes);
        if(jwRes.statusCode === 201 || jwRes.statusCode === 200) {
            childrens.loader.modal.closePopUp();
            //debugger;
            if(resData.reason === "any online") return this.childrens.anyModulo.modal.openPopUp();             
            console.log('resData ', resData.data.name)
            /*
            let printer = gui.Window.open('../../../views/imprime.html', {
              width: 5,
              height: 5
            }, (doc) => {
              console.log(doc,' doc');  
              //doc.setTransparent(true);
              doc.on('loaded', function() {
                console.log("loaded")
                doc.window.printToken(resData.data.name);              
              });              
            })
            */
            resolve(resData);
          } else {
            reject(new Error('UNEXPECTED_RESPONSE'));
          }
        })
      })
    )
  }//end create

  addChildren(name, child) {
   this.childrens[name] = child;
  }//end addChildren

  updateIp(form) {
    let input = this.refs[form].refs['input-ip'];
    if(input.state.valid) {
      let newIp = ReactDOM.findDOMNode(input).querySelector('input');
      window.localStorage.setItem('SADDRESS', newIp.value);
      this.refs.changeIpPopUp.modal.closePopUp();
      this.refs.restartPackPopUp.modal.openPopUp();
    }
  }

  restartApp() {
    command("killall -9 node", (error, stdout, stderr) => {
      if (error) {
        console.log(`exec error: ${error}`);
      }
      window.location.reload();        
    })
  }

  render() {
    return (
      <div>
        <section>
          <div className="wrap-instructions">
            <ul className="row">
              <li className="columns large-4">
                <h2><i className="material-icons">touch_app</i> Paso 1 </h2>
                <p>Toca el boton azul, para solicitar un turno, tu solicitud sera procesada por el sistema y si todo sale bien se imprimira un ficho con el nombre del turno.</p>
              </li>
              <li className="columns large-4">
                <h2><i className="material-icons">update</i> Paso 2</h2>
                <p>Espera tu turno atento al televisor, se estaran llamando los turnos por ese medio y pronto aparecera el tuyo.</p>
              </li>

              <li className="columns large-4">
                <h2><i className="material-icons">thumb_up</i> Paso 3</h2>
                <p>Una vez tu turno se muestre en el televisor, acercate a recepcion para ser atendido.</p>
              </li>
            </ul>
          </div>

          <div className="wrap-btn-request">
            <button className="bnt-request" onClick={ this.requestToken.bind(this) }>
              <i className="material-icons">touch_app</i>
              <span>Toca aqui para solicitar un turno</span>
            </button>
          </div>
        </section>

        <PopUp
          lift={ this.addChildren.bind(this, "loader") }
          id="loaderPopUp"
          ref="loaderPopUp"
          animation={ "rebound" }
          full={ false }
          type="load"
        />

        <PopUp
          lift={ this.addChildren.bind(this, "anyModulo") }
          id="anyModuloPopUp"
          animation={ "rebound" }
          full={ false }
          type="custom"
          data= {
            <div className="wrap-popup-info">
              <div>
                <i className="material-icons icon-stop">pan_tool</i>
                <h1 className="title-info">INFORMACIÓN</h1>
              </div>
              <p>En este momento no hay ningún recepcionista que pueda atender te.</p>
            </div>
          }
        />

        <PopUp
          id="changeIpPopUp"
          ref="changeIpPopUp"
          animation={ "rebound" }
          full={ false }
          type="custom"
          data= {
            <FormChangeIp
              ref="form-set-ip"
              title="DIRECCIÓN IP"
              onUpdate={this.updateIp.bind(this, 'form-set-ip')}
              ipMessage={`Dirección establecida en el sistema ${window.localStorage.getItem('SADDRESS')}`}
              placeholder={`Escribe la dirección ip que tiene el equipo actualmente`}
            />
          }
        />

        <PopUp
          id="wrongIpPopUp"
          ref="wrongIpPopUp"
          animation={ "rebound" }
          full={ false }
          type="custom"
          data= {
            <FormChangeIp
              ref="form-change-ip"
              onUpdate={this.updateIp.bind(this, 'form-change-ip')}
              type="error"
              title="Error"
              ipMessage={`La aplicacion no puede iniciar sobre la ip ${window.localStorage.getItem('SADDRESS')}`}
              placeholder={`Escribe la dirección ip que tiene el equipo actualmente`}
            />
          }
        />        
        
        <PopUp
          id="failPopUp"
          ref="failPopUp"
          animation={ "rebound" }
          full={ false }
          type="error"
          message="Se ha producido un error al iniciar la aplicación, por favor reinicia el pack."
        />

        <PopUp
          id="moduleListPopUp"
          ref="moduleListPopUp"
          animation={ "rebound" }
          full={ false }
          type="custom"
          afterOpen={ this.requestModules.bind(this) }
          data={ 
            <ModuleList ref="module-list"/> 
          }
        />

        <PopUp
          ref="restartPackPopUp"
          id="restartPackPopUp"
          animation={ "rebound" }
          full={ false }
          hideOptions={ false }
          onConfirm={ this.restartApp.bind(this) }
          type="confirm"
          title="INFORMACIÓN"
          message="¿ Desea reiniciar el pack ahora, para que los cambios tengan efecto ?"
        />

      </div>
    )
  }//end render
}
