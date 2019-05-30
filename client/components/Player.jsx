import React from 'react';

export default function Player(props) {
    const { streamUrl } = props;
    return (
        <video controls={false} autoPlay={true} name="media">
            <source src={streamUrl} type="audio/mpeg" />
        </video>
    );
}
