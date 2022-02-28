import React, {Component} from 'react';
import {View, Text, FlatList, Button, ScrollView} from 'react-native';


class SinglePost extends Component {
    render(){
        return(
            <ScrollView>
                <Text>Single Post</Text>
                
                
                <Button
                    title="Update Post"
                    color="darkblue"
                />

                <Button
                    title="Delete Post"
                    color="red"
                />
            </ScrollView>
        )
    }
}

export default SinglePost;