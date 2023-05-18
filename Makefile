start:
	nodemon --watch 'src/**/*.ts' --exec \"ts-node\" src/index.ts

test:
	jest --watch
