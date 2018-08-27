#!/bin/bash
mkdir -p docs
mkdir -p docs/js
cp -a public/. docs/
browserify src/main.ts -p [ tsify --noImplicitAny --lib ES2015 ] -o docs/js/bundle.js