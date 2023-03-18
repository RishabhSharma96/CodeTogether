import React, { useState } from 'react';
import '../Styles/CodeStyles.css'
import CodeMirror from '@uiw/react-codemirror';
import ACTIONS from '../Actions';
import { draculaInit } from '@uiw/codemirror-theme-dracula';
import { tags as t } from '@lezer/highlight';

export default function Code({ socketRef, roomID , onCodeChange , setSyncedCode }) {

    const [codeValue , setCodeValue] = useState()

    const onChange = React.useCallback((value, viewUpdate) => {
        // console.log(value);
        setSyncedCode(value)
        // onCodeChange(codeValue)

        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomID,
            value
        })

        socketRef.current.on(ACTIONS.CODE_CHANGE , ({value}) => {
            if(value !== null){
                setCodeValue(value)
            }
        })

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE)
        }

    }, [socketRef.current]);

    return (
        <div id='code-editor'>
            
            {/* <CodeMirror theme={dracula} /> */}
            <CodeMirror
            theme={draculaInit({
                settings : {
                    caret : '#c6c6c6',
                    fontFamily : 'monospace'
                },
                styles : [
                    {tag : t.comment, color: '#6272a4'}
                ]
            })}
                value={codeValue}
                height="99vh"
                width="100p"
                onChange={onChange}
            />
        </div>
    )
}
