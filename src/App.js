import React from "react";
import styled from 'styled-components';
import axios from 'axios';
const randomstring = require('randomstring');

const Div = styled.div`
    margin-right: auto;
    margin-left: auto;
    width: 20%;
`
const Button = styled.button`
    margin-left: 12.5%;
`
class LikeButton extends React.Component {
    state = { 
        value: ""
    }
    constructor(props) {
        super(props);
        this.state = { originalURL: '', newURL: "", newURLMessage: "" };
        this.redirect();
    }

    //Gets the data
    async getData(newURL)
    {
        try
        {
            const res = await axios.get('http://localhost:1337/posts');
            return res;
        }
        catch(e)
        {
            return 'http://localhost:3000'
        }
    }

    //Adds the data to the database
    async putData()
    {
        const newURL = "http://localhost:3000/" + randomstring.generate(6);
        await axios.post('http://localhost:1337/posts', { originalURL: this.state.originalURL, newURL })
        this.setState({ newURL, newURLMessage: "Here Is your new URL!:" });
    }

    //Used to redirect to new URL if there's a suitable pathname
    async redirect()
    {
        if (window.location.pathname !== '/')
        {
            const redirect = await this.getData(window.location.pathname);
            for (let i = 0; i < redirect.data.length; i++)
            {
                if (redirect.data[i].newURL === window.location.href)
                {
                    window.location.href = redirect.data[i].originalURL;
                }
            }
        }
    }

    //This is used to check if the url to be tiny-afied is a valid url
    isValidHttpUrl(string) {
        let url;
        
        try {
            url = new URL(string);
        } catch (e) {
            return false;  
        }
    
        return true;
    }

    //Click function for button
    clickMe()
    {
        if (this.isValidHttpUrl(this.state.originalURL))
        {
            this.putData();
        }
        else
        {
            alert("Not a url")
        }
    }

	//Updates state.value as the user inputs text
	handleChange = (event) =>
	{   
		this.setState({ originalURL: event.target.value });
	}
    
    render() {
        return (
        <Div>
            <h1>Tiny URL!</h1>
            <h3>Please Input URL below!</h3>
            <input
                type="text"
                value={this.state.originalURL}
                onChange={this.handleChange.bind(this)}>
            </input>
            <h5>{this.state.newURLMessage}</h5>
            <h5>{this.state.newURL}</h5>
            <Button onClick={this.clickMe.bind(this)}>
                Button
            </Button>
        </Div>
        );
    }
}

export default LikeButton;
