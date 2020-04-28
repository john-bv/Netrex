@echo off

if exist node_modules (
    goto run
) else (
    echo Installing needed dependencies, give this a moment.
    npm i > nul
    echo Done, attempting to start.
    goto run
)

:run
echo Starting...
npm run "start"
exit