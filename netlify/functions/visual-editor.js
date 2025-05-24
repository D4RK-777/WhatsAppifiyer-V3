// Simple handler for Netlify Visual Editor
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Visual Editor endpoint' }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
};
