FROM golang:1.19.3-bullseye

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - 
RUN apt-get update && apt-get install -y lua5.1 nodejs unzip
RUN go install github.com/lockval/starc2one@latest
RUN wget -L https://downloads.lockval.com/v0.0.14.amd64.linux.zip
RUN unzip -d ~ v0.0.14.amd64.linux.zip
# RUN echo "export GOPATH=$HOME/go" >> ~/.bashrc

ENV LC_ALL C.UTF-8

