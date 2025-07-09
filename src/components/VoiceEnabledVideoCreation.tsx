import React, { useEffect, useRef, useState } from 'react';

const VoiceEnabledVideoCreation: React.FC = () => {
    const [recording, setRecording] = useState(false);
    const [voiceCommands, setVoiceCommands] = useState<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasImage, setHasImage] = useState(false);
    
    useEffect(() => {
        // Direct approach: Draw a static image to canvas immediately
        const drawStaticImage = () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    // Create a colored rectangle as a fallback
                    ctx.fillStyle = '#e0f2f1';
                    ctx.fillRect(0, 0, 640, 360);
                    
                    // Draw text
                    ctx.fillStyle = '#00796b';
                    ctx.font = 'bold 24px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Voice-Enabled Video Creation', 320, 180);
                    
                    setHasImage(true);
                }
            }
        };
        
        // Draw static image right away
        drawStaticImage();
        
        // Try to load the project image
        const img = new Image();
        img.onload = () => {
            if (canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, 640, 360);
                    setHasImage(true);
                    console.log('Project image loaded successfully');
                }
            }
        };
        img.onerror = () => {
            console.error('Failed to load project image');
            // Already have a fallback drawn
        };
        img.src = '/0dbb2e88-b1da-4e14-86c6-237f0603b9d7.png';
        
    }, []);
    
    // Simplified video loading - just one reliable source
    useEffect(() => {
        if (videoRef.current) {
            try {
                // Local video element with reliable source
                videoRef.current.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
                videoRef.current.load();
                console.log('Video source set');
                
                // No autoplay - let user control it
            } catch (error) {
                console.error('Error setting video source:', error);
            }
        }
    }, []);

    const startRecording = () => {
        setRecording(true);
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript;
            setVoiceCommands((prev) => [...prev, command]);
        };
        recognition.start();
    };

    const stopRecording = () => {
        setRecording(false);
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.stop();
    };

    const generateVideo = () => {
        if (canvasRef.current) {
            console.log('Generating video...');
            
            try {
                const context = canvasRef.current.getContext('2d');
                
                if (videoRef.current && videoRef.current.readyState >= 2) {
                    // Video is loaded and can be played
                    if (context) {
                        context.drawImage(videoRef.current, 0, 0, 640, 360);
                        console.log('Drew video to canvas successfully');
                        alert('Video frame captured to canvas!');
                    }
                } else {
                    // Directly draw a colored rectangle with text
                    if (context) {
                        // Create a colored rectangle
                        context.fillStyle = '#4CAF50';
                        context.fillRect(0, 0, 640, 360);
                        
                        // Add text
                        context.fillStyle = 'white';
                        context.font = 'bold 28px Arial';
                        context.textAlign = 'center';
                        context.fillText('Video Generated!', 320, 150);
                        context.font = '18px Arial';
                        context.fillText('Generated on ' + new Date().toLocaleString(), 320, 190);
                        
                        console.log('Drew fallback content to canvas');
                        alert('Video generated with placeholder content!');
                    }
                }
            } catch (error) {
                console.error('Error generating video:', error);
                alert('Error generating video. Please try again.');
            }
        } else {
            console.error('Canvas reference is null');
        }
    };

    return (
        <div className="voice-enabled-video-creation" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Voice-Enabled Video Creation</h2>
            <div className="controls" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button onClick={startRecording} disabled={recording} style={{ padding: '12px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>Start Voice Interaction</button>
                <button onClick={stopRecording} disabled={!recording} style={{ padding: '12px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>Stop Voice Interaction</button>
                <button onClick={generateVideo} style={{ padding: '12px 20px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>Generate Video</button>
            </div>
            <div className="video-display" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <canvas ref={canvasRef} width="640" height="360" style={{ border: '2px solid #2196F3', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', backgroundColor: '#fff' }}></canvas>
                </div>
                <div style={{ position: 'relative', width: '640px' }}>
                    <p style={{ marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Sample Video:</p>
                    <video 
                        ref={videoRef} 
                        width="640" 
                        height="360" 
                        controls 
                        poster="/0dbb2e88-b1da-4e14-86c6-237f0603b9d7.png"
                        style={{ border: '2px solid #4CAF50', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
            {voiceCommands.length > 0 && (
                <div className="voice-commands">
                    <h3>Voice Commands:</h3>
                    <ul>
                        {voiceCommands.map((command, index) => (
                            <li key={index}>{command}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default VoiceEnabledVideoCreation;
