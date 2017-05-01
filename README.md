# Run locally

- Install Node.js
- Run : 
    ``` 
    node index.js

# Run with Docker
- Install Docker
- Build : 
    ```
    docker build -t "myapp" .

- Run : 
    ```
    docker run -it --rm -p 8090:8888 myapp

- Open app in browser : 
    ```
    192.168.99.100:8090 (Windows) 
    OR 
    localhost:8090 (Mac)