#!/bin/bash
mkdir -p docs
mkdir -p docs/js
cp -a public/. docs/
browserify --debug src/index.tsx -p [ tsify --noImplicitAny ] -o docs/js/bundle.js