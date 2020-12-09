FROM node:12

RUN apt update && \
    apt install libaio-dev -y && \
    wget https://download.oracle.com/otn_software/linux/instantclient/19600/instantclient-basic-linux.x64-19.6.0.0.0dbru.zip && \
    unzip instantclient-basic-linux.x64-19.6.0.0.0dbru.zip && \
    mkdir -p /opt/oracle && \
    mv instantclient_19_6 /opt/oracle

ENV PATH /opt/oracle/instantclient_19_6:$PATH
ENV LD_LIBRARY_PATH /opt/oracle/instantclient_19_6:$LD_LIBRARY_PATH

# Wallet should be placed at: /opt/oracle/instantclient_19_5/network/admin

WORKDIR /home

COPY package*.json /home/

RUN npm install

COPY . /home

EXPOSE 5000

CMD ["node", "server.js"]