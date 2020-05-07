#!/bin/bash
if [[ $# = 1 ]]
then
	git add .
	git status
	git commit -m "$1"

fi
