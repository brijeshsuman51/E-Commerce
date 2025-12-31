import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;

# Make sure dist/ folder is not in .gitignore
# Comment out or remove 'dist/' from frontend/.gitignore

git add .
git commit -m "Added production build and configuration"
git push origin main