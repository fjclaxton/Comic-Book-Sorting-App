// 1. Handle Standard Username/Password Login
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log("Attempting login for:", username);

    try {
        // Update the URL to your AWS Lambda/API Gateway or Pi address
        const response = await fetch('https://your-api-url.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Login Successful!");
            // Store token and redirect user
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert("Login Failed: " + data.message);
        }
    } catch (error) {
        console.error("Error connecting to backend:", error);
        alert("Could not connect to the server.");
    }
};

document.getElementById('signupForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://your-api-url.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Account created successfully!");
            localStorage.setItem('token', data.token); // Save login session
            window.location.href = 'dashboard.html';    // Direct redirect
        } else {
            alert("Error: " + data.message);
        }
    } catch (error) {
        alert("Could not connect to the server.");
    }
};

// 2. Handle Google Login Response
function handleGoogleResponse(response) {
    const googleToken = response.credential;
    console.log("Google JWT received. Sending to backend...");

    fetch('https://your-api-url.com/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Backend confirmed Google Login:", data);
        window.location.href = 'dashboard.html';
    })
    .catch(err => console.error("Google Auth Error:", err));
}