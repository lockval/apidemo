FROM golang:1.19.4-bullseye

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - 
RUN apt-get update && apt-get install -y lua5.1 nodejs unzip
RUN go install github.com/lockval/starc2one@latest
RUN wget -L https://downloads.lockval.com/latest.amd64.linux.zip
RUN unzip -d ~ latest.amd64.linux.zip
# RUN echo "export GOPATH=$HOME/go" >> ~/.bashrc

ENV LC_ALL C.UTF-8

