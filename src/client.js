import * as sapper from '@sapper/app';
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

sapper.start({
	target: document.querySelector('#sapper')
});