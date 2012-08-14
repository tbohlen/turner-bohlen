#!/bin/bash
type dos2unix >/dev/null 2>&1 || { echo >&2 "We need dos2unix to create the documentation. Please install it and then run this script again"; exit 1; }
DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
INPUT="${DIR}/src"
OUTPUT="${DIR}/docs"
PROJECT="${DIR}/"
NaturalDocs -i $INPUT -o framedHTML $OUTPUT -p $PROJECT
dos2unix "${DIR}/docs/javascript/main.js"
dos2unix "${DIR}/docs/styles/main.css"
echo "Done!"
