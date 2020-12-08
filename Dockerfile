FROM node:12

RUN apt update && \
    apt install libaio-dev -y && \
    wget https://download.oracle.com/otn_software/linux/instantclient/195000/instantclient-basic-linux.x64-19.5.0.0.0dbru.zip && \
    unzip instantclient-basic-linux.x64-19.5.0.0.0dbru.zip && \
    mkdir -p /opt/oracle && \
    mv instantclient_19_5 /opt/oracle

ENV LD_LIBRARY_PATH /opt/oracle/instantclient_19_5:$LD_LIBRARY_PATH

# Wallet should be placed at: /opt/oracle/instantclient_19_5/network/admin

WORKDIR /home

COPY package*.json ./

RUN npm install

COPY . /home

EXPOSE 5000

CMD ["node", "server.js"]