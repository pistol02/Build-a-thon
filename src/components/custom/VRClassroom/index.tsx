"use client"

import { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the GoogleGenerativeAI library

const VRClassroom = () => {
    // State management
    const [question, setQuestion] = useState("")
    const [geminiResponse, setGeminiResponse] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [isTeacherMode, setIsTeacherMode] = useState(false)
    const [students, setStudents] = useState([])
    const [scene, setScene] = useState(null)
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 1.6, z: 3 }) // Initial camera position

    // Refs
    const mountRef = useRef(null)
    const rendererRef = useRef(null)
    const whiteboardRef = useRef(null)
    const teacherAvatarRef = useRef(null)
    const cameraRef = useRef(null)

    const genAI = new GoogleGenerativeAI('AIzaSyDpz578NYLaLObposCGopfoF2F92jpISFY'); // Replace with your API key
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Use the desired model

    // Function to fetch Gemini response using GoogleGenerativeAI
    const fetchGeminiResponse = async (question) => {
        try {
            // Generate content using the Gemini model
            const result = await model.generateContent(question);
            const response = await result.response;
            const text = response.text(); // Extract the generated text

            // Remove ** from the response
            const cleanedText = text.replace(/\\/g, '');

            // Summarize the Gemini response (you can customize this logic)
            const summary = cleanedText.split('.').slice(0, 8).join('.') + '.';
            return summary;
        } catch (err) {
            console.error('Error fetching Gemini response:', err);
            throw new Error('Failed to fetch Gemini response.');
        }
    };

    // Function to convert text to speech
    const speakText = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    };

    // Function to fetch AI response
    const fetchResponse = async (questionText) => {
        try {
            setLoading(true)
            setError("")

            // Fetch text response from Gemini
            const summary = await fetchGeminiResponse(questionText);
            setGeminiResponse(summary);

            // Convert the response to speech
            speakText(summary);

            // Update whiteboard
            if (whiteboardRef.current) {
                updateWhiteboard(summary);
            }

            // Make avatars react - simulate student engagement
            animateStudentReactions();
        } catch (err) {
            console.error("Error fetching response:", err);
            setError("Failed to fetch response: " + (err.message || "Unknown error"));
            setGeminiResponse("Error: " + error);
        } finally {
            setLoading(false)
        }
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (question.trim()) {
            fetchResponse(question);
        }
    };

    // Function to update the whiteboard with AI response
    const updateWhiteboard = (text) => {
        if (!whiteboardRef.current) return;

        const { canvas, context, texture } = whiteboardRef.current;

        // Clear the canvas
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Add border
        context.strokeStyle = "#000000";
        context.lineWidth = 4;
        context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Configure text
        context.fillStyle = "#000000";
        context.font = "bold 36px Arial";
        context.textAlign = "center";
        context.fillText("Virtual Classroom Whiteboard", canvas.width / 2, 50);

        // Draw the AI response
        context.font = "24px Arial";
        context.textAlign = "left";

        // Word wrap the text
        const maxWidth = canvas.width - 40;
        const lineHeight = 30;
        let y = 100;

        const words = text.split(" ");
        let line = "";

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && i > 0) {
                context.fillText(line, 20, y);
                line = words[i] + " ";
                y += lineHeight;

                // Check if we've reached the bottom of the whiteboard
                if (y > canvas.height - 20) {
                    context.fillText("...", 20, y);
                    break;
                }
            } else {
                line = testLine;
            }
        }

        context.fillText(line, 20, y);

        // Update the texture
        texture.needsUpdate = true;
    };

    // Function to create a face texture for avatars
    const createFaceTexture = (isTeacher = false, gender = 'neutral') => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');

        // Skin tones with gradient effect for better realism
        const skinTones = ['#2c222b'];
        const skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];

        const gradient = context.createRadialGradient(256, 256, 150, 256, 256, 240);
        gradient.addColorStop(0, skinTone);
        gradient.addColorStop(1, '#2c222b');

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(256, 256, 240, 0, Math.PI * 2);
        context.fill();

        // Hair colors and styles
        const hairColors = ['#000000'];
        const hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];

        context.fillStyle = hairColor;
        context.beginPath();


        context.ellipse(256, 150, 250, 200, 0, 0, Math.PI * 2);
        context.fill();
        context.globalCompositeOperation = 'destination-out';
        context.beginPath();
        context.ellipse(256, 260, 200, 220, 0, 0, Math.PI * 2);
        context.fill();
        context.globalCompositeOperation = 'source-over';


        // Eye properties with slight variations
        const eyeColors = ['#634e34', '#2e536f', '#3d671d', '#1c7847', '#497665', '#91a3b0'];
        const eyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
        const eyeOffset = Math.random() * 10 - 5;

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.ellipse(180 + eyeOffset, 220, 50, 30, 0, 0, Math.PI * 2);
        context.ellipse(332 + eyeOffset, 220, 50, 30, 0, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = eyeColor;
        context.beginPath();
        context.arc(180 + eyeOffset, 220, 20, 0, Math.PI * 2);
        context.arc(332 + eyeOffset, 220, 20, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(190 + eyeOffset, 210, 8, 0, Math.PI * 2);
        context.arc(342 + eyeOffset, 210, 8, 0, Math.PI * 2);
        context.fill();

        // Eyebrows with random arch height
        context.strokeStyle = hairColor;
        context.lineWidth = 8;
        context.lineCap = 'round';
        const browHeight = Math.random() * 10 - 5;
        context.beginPath();
        context.moveTo(140, 180 + browHeight);
        context.quadraticCurveTo(180, 160 + browHeight, 220, 180 + browHeight);
        context.moveTo(292, 180 + browHeight);
        context.quadraticCurveTo(332, 160 + browHeight, 372, 180 + browHeight);
        context.stroke();

        // Nose with slight width variation
        const noseWidth = Math.random() * 10 + 3;
        context.strokeStyle = '#00000033';
        context.lineWidth = noseWidth;
        context.beginPath();
        context.moveTo(256, 230);
        context.lineTo(256, 300);
        context.quadraticCurveTo(270, 320, 256, 330);
        context.stroke();

        // Mouth with dynamic expressions
        const smileFactor = Math.random();
        context.strokeStyle = '#000000';
        context.lineWidth = 4;
        context.beginPath();

        if (smileFactor > 0.7) {
            // Smiling mouth
            context.moveTo(200, 370);
            context.quadraticCurveTo(256, 420, 312, 370);
        } else if (smileFactor > 0.4) {
            // Neutral mouth
            context.moveTo(200, 370);
            context.lineTo(312, 370);
        } else {
            // Frowning mouth
            context.moveTo(200, 370);
            context.quadraticCurveTo(256, 340, 312, 370);
        }
        context.stroke();

        // Lips with subtle shading
        context.fillStyle = '#c5756c';
        context.beginPath();
        context.moveTo(200, 370);
        context.quadraticCurveTo(256, 400, 312, 370);
        context.quadraticCurveTo(256, 385, 200, 370);
        context.fill();

        // Teacher features: Glasses and optional beard/mustache
        if (isTeacher) {
            context.strokeStyle = '#000000';
            context.lineWidth = 4;
            context.beginPath();
            context.ellipse(180, 220, 60, 40, 0, 0, Math.PI * 2);
            context.ellipse(332, 220, 60, 40, 0, 0, Math.PI * 2);
            context.moveTo(240, 220);
            context.lineTo(272, 220);
            context.moveTo(120, 220);
            context.lineTo(90, 200);
            context.moveTo(392, 220);
            context.lineTo(422, 200);
            context.stroke();

            // Mustache and beard for male teachers
            if (gender !== 'female' && Math.random() > 0.3) {
                context.fillStyle = hairColor;
                context.beginPath();
                context.moveTo(200, 350);
                context.quadraticCurveTo(256, 370, 312, 350);
                context.quadraticCurveTo(256, 390, 200, 350);
                context.fill();

                if (Math.random() > 0.5) {
                    context.beginPath();
                    context.moveTo(200, 370);
                    context.quadraticCurveTo(256, 450, 312, 370);
                    context.quadraticCurveTo(256, 420, 200, 370);
                    context.fill();
                }
            }
        }

        return new THREE.CanvasTexture(canvas);
    };


    // Function to create a detailed avatar
    const createDetailedAvatar = (isTeacher = false, color = 0x1a75ff) => {
        const avatarGroup = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff5733 }); // Orange color for the shirt
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.5;
        avatarGroup.add(body);

        // Head
        const headGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.05;
        avatarGroup.add(head);

        // Hair
        const hairGeometry = new THREE.BoxGeometry(0.32, 0.15, 0.32);
        const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black color for the hair
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.set(0, 1.2, 0);
        avatarGroup.add(hair);

        // Eyes
        const createEye = (x, y, z) => {
            const eyeGeometry = new THREE.SphereGeometry(0.03, 32, 32);
            const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eye.position.set(x, y, z);
            return eye;
        };

        const leftEye = createEye(-0.08, 1.1, 0.15);
        const rightEye = createEye(0.08, 1.1, 0.15);
        avatarGroup.add(leftEye);
        avatarGroup.add(rightEye);

        // Mouth
        const mouthGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.01);
        const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        mouth.position.set(0, 1.0, 0.15);
        avatarGroup.add(mouth);

        // Arms
        const createArm = (side = 1) => {
            const armGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1);
            const armMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.position.set(side * 0.25, 0.5, 0);
            return arm;
        };

        const leftArm = createArm(-1);
        const rightArm = createArm(1);
        avatarGroup.add(leftArm);
        avatarGroup.add(rightArm);

        // Legs
        const createLeg = (side = 1) => {
            const legGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
            const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue color for the pants
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(side * 0.15, 0.25, 0);
            return leg;
        };

        const leftLeg = createLeg(-1);
        const rightLeg = createLeg(1);
        avatarGroup.add(leftLeg);
        avatarGroup.add(rightLeg);

        return avatarGroup;
    };

    // Function to animate student reactions
    const animateStudentReactions = () => {
        if (!students.length) return

        // Randomly select students to animate
        const numReacting = Math.floor((Math.random() * students.length) / 2) + 1
        const reactingIndices = []

        while (reactingIndices.length < numReacting) {
            const idx = Math.floor(Math.random() * students.length)
            if (!reactingIndices.includes(idx)) {
                reactingIndices.push(idx)
            }
        }

        // Animate selected students
        reactingIndices.forEach((idx) => {
            const student = students[idx]

            // Get the head of the student
            const head = student.children.find(
                (child) => child.geometry && child.geometry.type === "SphereGeometry" && child.position.y > 1,
            )

            if (head) {
                // Create a nodding animation
                const startRotation = head.rotation.x
                const numNods = Math.floor(Math.random() * 3) + 1
                let nodCount = 0

                const nodAnimation = setInterval(() => {
                    head.rotation.x = startRotation + Math.sin(Date.now() * 0.01) * 0.2
                    nodCount++

                    if (nodCount > numNods * 10) {
                        clearInterval(nodAnimation)
                        head.rotation.x = startRotation
                    }
                }, 50)
            }

            // Randomly raise hand for some students
            if (Math.random() > 0.7) {
                // Find the right arm
                const rightArm = student.children.find(
                    (child) => child instanceof THREE.Group && child.position.x > 0 && child.position.y > 0.5,
                )

                if (rightArm) {
                    const originalRotation = rightArm.rotation.z
                    rightArm.rotation.z = -Math.PI / 2 // Raise arm

                    // Lower arm after a few seconds
                    setTimeout(
                        () => {
                            rightArm.rotation.z = originalRotation
                        },
                        3000 + Math.random() * 2000,
                    )
                }
            }
        })
    }

    // Three.js setup
    useEffect(() => {
        if (typeof window === "undefined") return

        // Scene setup
        const newScene = new THREE.Scene()
        newScene.background = new THREE.Color(0xf0f0f0)
        setScene(newScene)

        // Camera setup
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.position.set(0, 1.6, 3)
        cameraRef.current = camera

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        rendererRef.current = renderer

        mountRef.current.appendChild(renderer.domElement)

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 2)
        newScene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(1, 1, 1)
        newScene.add(directionalLight)

        const roomGeometry = new THREE.BoxGeometry(10, 7, 8);
        const roomMaterials = [
            new THREE.MeshStandardMaterial({ color: 0x8B4513, side: THREE.BackSide }), // Left wall (brown)
            new THREE.MeshStandardMaterial({ color: 0x8B4513, side: THREE.BackSide }), // Right wall (brown)
            new THREE.MeshStandardMaterial({ color: 0xF5F5DC, side: THREE.BackSide }), // Floor (beige)
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.BackSide }), // Ceiling (white)
            new THREE.MeshStandardMaterial({ color: 0xADD8E6, side: THREE.BackSide }), // Back wall (light blue)
            new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.BackSide }), // Front wall (white, where the whiteboard is)
        ];
        const room = new THREE.Mesh(roomGeometry, roomMaterials);
        newScene.add(room);

        // Create classroom furniture
        const createClassroomFurniture = () => {
            const furnitureGroup = new THREE.Group()

            // Teacher's desk
            const deskGeometry = new THREE.BoxGeometry(1.2, 0.05, 0.6)
            const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 })
            const desk = new THREE.Mesh(deskGeometry, deskMaterial)
            desk.position.set(0, 0.5, -3)
            furnitureGroup.add(desk)

            // Desk legs
            const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8)
            for (let x = -0.55; x <= 0.55; x += 1.1) {
                for (let z = -0.25; z <= 0.25; z += 0.5) {
                    const leg = new THREE.Mesh(legGeometry, deskMaterial)
                    leg.position.set(x, 0.25, z - 3)
                    furnitureGroup.add(leg)
                }
            }

            // Student desks and chairs
            const createStudentDesk = (x, z) => {
                const deskGroup = new THREE.Group()

                // Desk top
                const deskTop = new THREE.Mesh(
                    new THREE.BoxGeometry(0.7, 0.05, 0.5),
                    new THREE.MeshStandardMaterial({ color: 0xd2b48c }),
                )
                deskTop.position.y = 0.4
                deskGroup.add(deskTop)

                // Desk legs
                for (let dx = -0.3; dx <= 0.3; dx += 0.6) {
                    for (let dz = -0.2; dz <= 0.2; dz += 0.4) {
                        const leg = new THREE.Mesh(
                            new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
                            new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
                        )
                        leg.position.set(dx, 0.2, dz)
                        deskGroup.add(leg)
                    }
                }

                // Chair
                const chairSeat = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.05, 0.4),
                    new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
                )
                chairSeat.position.set(0, 0.25, 0.5)
                deskGroup.add(chairSeat)

                // Chair legs
                for (let dx = -0.15; dx <= 0.15; dx += 0.3) {
                    for (let dz = 0.35; dz <= 0.65; dz += 0.3) {
                        const leg = new THREE.Mesh(
                            new THREE.CylinderGeometry(0.02, 0.02, 0.25, 8),
                            new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
                        )
                        leg.position.set(dx, 0.125, dz)
                        deskGroup.add(leg)
                    }
                }

                // Chair back
                const chairBack = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.3, 0.05),
                    new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
                )
                chairBack.position.set(0, 0.4, 0.7)
                deskGroup.add(chairBack)

                deskGroup.position.set(x, 0, z)
                return deskGroup
            }

            // Create a grid of student desks
            const rows = 3
            const cols = 5
            const startX = -3
            const startZ = -1
            const spacingX = 1.5
            const spacingZ = 1.2

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = startX + col * spacingX
                    const z = startZ + row * spacingZ
                    const desk = createStudentDesk(x, z)
                    furnitureGroup.add(desk)
                }
            }

            return furnitureGroup
        }

        // Add furniture to the scene
        const furniture = createClassroomFurniture()
        newScene.add(furniture)

        // Whiteboard setup
        const whiteboardCanvas = document.createElement("canvas")
        whiteboardCanvas.width = 1024
        whiteboardCanvas.height = 512
        const whiteboardContext = whiteboardCanvas.getContext("2d")

        const whiteboardTexture = new THREE.CanvasTexture(whiteboardCanvas)
        const whiteboardGeometry = new THREE.PlaneGeometry(6, 3)
        const whiteboardMaterial = new THREE.MeshStandardMaterial({
            map: whiteboardTexture,
            side: THREE.DoubleSide,
        })
        const whiteboard = new THREE.Mesh(whiteboardGeometry, whiteboardMaterial)
        whiteboard.position.set(0, 1.5, -3.9)
        newScene.add(whiteboard)

        // Store whiteboard references
        whiteboardRef.current = {
            canvas: whiteboardCanvas,
            context: whiteboardContext,
            texture: whiteboardTexture,
            mesh: whiteboard,
        }

        // Initialize whiteboard
        updateWhiteboard("Welcome to the VR Classroom!\nAsk a question to begin.")

        // Create teacher avatar
        const teacher = createDetailedAvatar(true, 0x008000) // Green color for teacher
        teacher.position.set(0, 0, -3) // Place at the front of class
        teacherAvatarRef.current = teacher
        newScene.add(teacher)

        // Create student avatars
        const studentColors = [0x1a75ff, 0xff6347, 0x9370db, 0xff8c00, 0x20b2aa, 0xff69b4];

        // Calculate student positions based on desk locations
        // Calculate student positions based on desk locations
        const rows = 3;
        const cols = 5;
        const startX = -3;
        const startZ = -1;
        const spacingX = 1.5;
        const spacingZ = 1.2;

        // Define teacher desk area
        const teacherDeskArea = {
            minX: -0.6, // Left boundary of the teacher's desk
            maxX: 0.6,  // Right boundary of the teacher's desk
            minZ: -3.3, // Front boundary of the teacher's desk
            maxZ: -2.7, // Back boundary of the teacher's desk
        };

        const studentPositions = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * spacingX;
                const z = startZ + row * spacingZ + 0.5; // Position at the chair

                // Check if the position is within the teacher's desk area
                const isInTeacherDeskArea =
                    x >= teacherDeskArea.minX &&
                    x <= teacherDeskArea.maxX &&
                    z >= teacherDeskArea.minZ &&
                    z <= teacherDeskArea.maxZ;

                // Skip positions within the teacher's desk area
                if (!isInTeacherDeskArea) {
                    studentPositions.push({ x, z });
                }
            }
        }

        // Create students and place them at desks
        const studentAvatars = [];
        for (let i = 0; i < studentPositions.length; i++) {
            const color = studentColors[i % studentColors.length];
            const student = createDetailedAvatar(false, color);

            // Adjust position to sit on the chair
            student.position.set(studentPositions[i].x, 0.4, studentPositions[i].z); // Y position adjusted for sitting
            // Adjust the body rotation to simulate sitting
            student.rotation.y += Math.PI; // Rotate 180 degrees to face the whiteboard

            studentAvatars.push(student);
            newScene.add(student);
        }

        // Remove the first student
        if (studentAvatars.length > 0) {
            const firstStudent = studentAvatars.shift(); // Remove the first student
            newScene.remove(firstStudent); // Remove the student from the scene
        }

        // Randomly remove 4 more students
        for (let i = 0; i < 4; i++) {
            if (studentAvatars.length > 0) {
                const randomIndex = Math.floor(Math.random() * studentAvatars.length); // Get a random index
                const removedStudent = studentAvatars.splice(randomIndex, 1)[0]; // Remove the student at the random index
                newScene.remove(removedStudent); // Remove the student from the scene
            }
        }

        // Store remaining students in state
        setStudents(studentAvatars);
        // Orbit controls for non-VR mode
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 1.6, 0);
        controls.update();

        // Animation loop
        const animate = () => {
            // Update controls
            controls.update();

            // Render the scene
            renderer.render(newScene, camera);
        };

        renderer.setAnimationLoop(animate);

        // Handle window resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", onWindowResize);

        // Cleanup function
        return () => {
            window.removeEventListener("resize", onWindowResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Function to move the camera left or right
    const moveCamera = (direction) => {
        if (!cameraRef.current) return;

        const speed = 0.5; // Adjust speed as needed
        const newX = cameraRef.current.position.x + (direction === 'left' ? -speed : speed);

        // Clamp the camera's X position to stay within the classroom bounds
        const minX = -4; // Left boundary
        const maxX = 4;  // Right boundary
        cameraRef.current.position.x = Math.max(minX, Math.min(maxX, newX));
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",  // Full viewport width
            flexDirection: "column", // Stack children vertically
        }}>
            {/* 3D Scene Container */}
            <div ref={mountRef} style={{ width: "100%", height: "70vh" }} />

            {/* UI Container (centered below the 3D scene) */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "600px",
                    margin: "20px auto",
                    padding: "20px",
                    backgroundColor: "#ffffff", // Changed to white
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <h2 style={{ color: "#000000" }}>VR Classroom</h2> {/* Ensure text remains visible */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc"
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: loading ? "#ccc" : "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Loading..." : "Ask"}
                    </button>
                </form>

                {/* Horizontal Travel Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button
                        onClick={() => moveCamera('left')}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: "#00ff00",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() => moveCamera('right')}
                        style={{
                            padding: "10px",
                            fontSize: "16px",
                            backgroundColor: "#00ff00",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Move Right
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VRClassroom;