import React from 'react';

export default function Player(props) {
    const { streamUrls } = props;
    // const audioCtx = new AudioContext();
    return (
        <audio controls={false} autoPlay={true} name="media">
            { streamUrls.map(({ streamUrl, contentType }) => (
                <source src={streamUrl} type={contentType} />
            )) }
        </audio>
    );
}
