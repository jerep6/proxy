FROM node:8.8.1

ENV PORT "3000"

ADD "." /app

CMD ["/bin/bash", "-c", "node /app/server.js $PORT"]
