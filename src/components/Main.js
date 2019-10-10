import React from 'react'
    //Navbar with account address
    class Main extends React.Component{

        render() {
            return(
                <span className="text-center">
                <form className="container mt-5" onSubmit={this.props.onSubmit}>
                <img className=" mb-5"src={this.props.img} />
                <h2  className="mb-3">Change meme</h2>
                <div class="custom-file row">
                    <input type="file" className="custom-file-input col"  onChange={this.props.captureFile}/>
                    <label className="custom-file-label col" for="inputGroupFile01">Choose file</label>

                  </div>
<input className="btn btn-primary mt-3 col-4" type="submit" value="Submit" />

                </form>
                </span>
            );

        }
    }

export default Main
