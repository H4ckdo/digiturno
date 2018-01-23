let gui = require('nw.gui');
const command = require('child_process').exec;
let win = gui.Window.get();
gui.Window.get().maximize();

let config = {
	SADDRESS: window.localStorage.getItem('SADDRESS')
}

window.SADDRESS = global.process.env.SADDRESS || process.env.SADDRESS || config.SADDRESS ||  "localhost";
	var menu = new nw.Menu({ type: 'menubar' })
	var submenu = new nw.Menu();
	submenu.append(new nw.MenuItem({
	  label: 'Direccion IP',
	  click: () => {
			window.changeIpPopUp.modal.openPopUp();
	  }
	}))

	
	submenu.append(new nw.MenuItem({
	  label: 'Listado de modulos',
	  click: () => {
			moduleListPopUp.modal.openPopUp();
	  }
	}))
		
	submenu.append(new nw.MenuItem({
	  label: 'Cerrar',
	  click: () => {
      command("killall -9 node", (error, stdout, stderr) => {
				console.log(`exec error: ${error}`);
				nw.App.quit();
      })
	  }
	}))
	
	menu.append(new nw.MenuItem({
	  label: 'Archivo',
	  submenu: submenu
	}));
	
	nw.Window.get().menu = menu;
          
