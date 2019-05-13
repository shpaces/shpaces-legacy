import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Redirect} from 'react-router-dom';
import { Provider } from 'react-redux';
import { TitleBar } from 'electron-react-titlebar'
const storage = require('electron-storage');


import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Theme as UWPThemeProvider, getTheme } from "react-uwp/Theme";


import store from './reducers';
import App from './containers/app.js'
import Home from './containers/home'
import FileExplorer from './containers/FileExplorer'


const theme = createMuiTheme({
	palette: {
	  type: 'dark',
	},
});

// import { Titlebar, Color } from '@inceldes/cet'
 
// new Titlebar({
// 	backgroundColor: Color.fromHex('#424242'), 
// 	drag: true, 
//   shadow: true, 
//   titleHorizontalAlignment: 'center', 
//   menuPosition: 'left'
// });

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing.unit * 7 + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9 + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
});


let path = './settings/settings.json'

// console.log('hi', storage.get)

let userSettings = storage.get(path, (err, data) => {
  if (err) {
    console.error(err)
  } else {
    console.log(data);
    // userSettings = data
    return data
  }
})

// console.log('🚀', userSettings)
// let thisUserSettings = async () => { 
//   const result = await storage.get(path, (err, data) => {
//     if (err) {
//       console.error(err)
//     } else {
//       console.log(data);
//       // userSettings = data
//       return data
//     } 
//   })
//   return result
// }
// console.log('🖤', thisUserSettings)



ReactDOM.render(
	<div> 
	{/* <TitleBar className="nav_bar" /> */}
		<MuiThemeProvider theme={theme}>
		<UWPThemeProvider
			theme={getTheme({
				themeName: "dark", // set custom theme
				accent: "#0078D7", // set accent color
				useFluentDesign: true, // sure you want use new fluent design.
			})}
			>
		<Provider store={store}>			
			<Router>
				<div className="app">
          <Redirect from="/" to="workspaces" />
					<Route path="/workspaces" component={App} classes={styles} />
					<Route path="/home" component={Home} classes={styles} userSettings={userSettings}/>
				</div>
			</Router>
		</Provider>
		</UWPThemeProvider>
		</MuiThemeProvider>

	</div>,
	document.getElementById('root')
);
