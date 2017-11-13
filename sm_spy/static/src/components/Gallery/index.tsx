import * as React from "react";

const Lightbox = require('react-image-lightbox');


interface IPhotos {
    src: string,
    srcSet?: Array<string>,
    alt?: string,
    sizes?: Array<string>,
    width: number,
    height: number
}

interface IGalleryProps {
    cols?: number,
    margin?: number,
    photos: Array<IPhotos>,
    onClickPhoto?: (number, HTMLElement) => void
}

interface IGalleryState {
    containerWidth: number
    photos: string,
    lightboxIsOpen: boolean
    currentImage: string
}

interface GalleryVariable {
    clientWidth: number,

}

class Gallery extends React.Component<IGalleryProps, IGalleryState> {

    props: IGalleryProps
    _gallery: GalleryVariable

    public static defaultProps: Partial<IGalleryProps> = {
        cols: 2,
        margin: 2
    };

	constructor(props: IGalleryProps){
		super(props);
		this.state = {
			containerWidth: 0,
            photos: "",
            lightboxIsOpen: false,
            currentImage: ''
		};
		this.handleResize = this.handleResize.bind(this);
	}
	componentDidMount(){
		this.setState({containerWidth: Math.floor(this._gallery.clientWidth)})
		window.addEventListener('resize', this.handleResize);
	}
	componentDidUpdate(){
		if (this._gallery.clientWidth !== this.state.containerWidth){
			this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
		}
	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.handleResize, false);
	}
	handleResize(e){
		this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
	}
	aspectRatio({width, height}){
		return width / height;
	}
	scalePhotoDimensions(){
		const { cols, margin, photos} = this.props;
		// subtract 1 pixel because the browser may round up a pixel
		const containerWidth = this.state.containerWidth - 1;

		// divide photos in rows based on cols per row [[1,2,3],[4,5,6],[7,8]]]
		let rows = photos.reduce((acc,item,idx) => {
			const rowNum = Math.floor(idx / cols);
			acc[rowNum] = acc[rowNum] ? [...acc[rowNum], item] : [item];
			return acc;
		},[]);

		// scale the image dimensions
		rows = rows.map((row) => {
			const totalAspectRatio = row.reduce((acc, photo, idx) => acc + this.aspectRatio(photo), 0);
			// calculate the width differently if its the last row and there are fewer photos left than col num
			const rowWidth = (row.length < cols) ?  Math.floor((containerWidth / cols) * row.length - (row.length * (margin * 2))) :
													Math.floor(containerWidth - (row.length * (margin * 2)));
			const rowHeight = rowWidth / totalAspectRatio;
			return row.map(photo => ({
				...photo,
				width: rowHeight * (this.aspectRatio(photo)),
				height: rowHeight
			}));
		});
		// flatten back the photos array
		return rows.reduce((acc,row) => [...acc, ...row], []);
	}

	closeLightbox() {
	    this.setState({
            lightboxIsOpen: false
        });
    }

    gotoPrevious() {

    }

    gotoNext() {

    }

    onClickPhoto(idx, e) {
		e.preventDefault();
	    this.setState({
			lightboxIsOpen: true,
			currentImage: e.target.src
		});
	    if (this.props.onClickPhoto) {
	        this.props.onClickPhoto(idx, e);
        }
    }

	render(){
		const resizedPhotos = this.scalePhotoDimensions();
		style.margin = this.props.margin;
		return(
			<div id="Gallery" className="clearfix" ref={(c) => this._gallery = c}>
				{resizedPhotos.map((photo,idx) =>
		    		<div style={style} key={idx}>
						<a href="#" onClick={(e) => this.onClickPhoto(idx, e)}>
							<img
                                src={photo.src}
                                srcSet={photo.srcset ? photo.srcset.join() : null}
                                sizes={photo.sizes ?  photo.sizes.join(): null}
                                style={{display:'block', border:0}}
                                height={photo.height}
                                width={photo.width}
                                alt={photo.alt ? photo.alt : null}
                            />
						</a>
		    		</div>
				)}

				{ this.state.lightboxIsOpen &&
					<Lightbox
                        mainSrc={this.state.currentImage}
                        onCloseRequest={() => this.closeLightbox()}
                        onMovePrevRequest={() => this.gotoNext() }
                        onMoveNextRequest={() => this.gotoPrevious() }
						imagePadding={50}
                    />
				}
	    	</div>
		);
	}
};
// Gallery image style
const style = {
	display: 'block',
	backgroundColor:'#e3e3e3',
	float: 'left',
    margin: 0
}

export default Gallery;