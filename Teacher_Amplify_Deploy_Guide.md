# Birthday Paradox Interactive Game
## Easy Deployment Guide for Teachers

This interactive game helps students understand probability through the fascinating Birthday Paradox.

I'm a big believer in privacy so made try to make this code very easy to copy/fork (consolidated into two files - no db requirements, etc.).

With Amplify you can deploy this for your students in just a few minutes!  I tested doing so a few different ways and modified the structure a bit to make it even easier.  

### Quick Deploy Method (Easiest)
1. Download the `birthday-paradox-dist.zip` file from this repository
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click "Get Started" with Hosting
4. Choose "Deploy without Git provider"
5. Drag and drop the `birthday-paradox-dist.zip` file
6. Click "Save and deploy"

That's it! Amplify will give you a URL you can share with your students.

### Customization Method (If you want to make changes)
1. Fork this repository
2. Make your desired changes
3. Run these commands in your terminal:
```bash
npm install
npm run build
