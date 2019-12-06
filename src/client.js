import * as sapper from '@sapper/app';
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import "jspanel4/es6module/jspanel.css"

sapper.start({
	target: document.querySelector('#sapper')
});