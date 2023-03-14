import React from 'react'
import Avatar from 'react-avatar'

export default function Client(props) {
    return (
        <div>
            <div className="people-i">
                <div className="peoplelogo"> <Avatar name={props.username} size={50} round="14px" /> </div>
                <div className="peoplename">{props.username}</div>
            </div>
        </div>
    )
}
