@echo off
if NOT EXIST ./node_module (
    echo NOPE
    pause > nul
    ::npm i > nul
)

npm run start > nul
echo owo
pause