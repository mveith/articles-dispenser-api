export function hello(event, context, callback) {
  callback(null, {
    body: 'Hello from TypeScript!', 
    status: 200
  });
};