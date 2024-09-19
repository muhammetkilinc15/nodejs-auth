import jwt from 'jsonwebtoken';

export const generateTokenSetCookie = (res, user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const cookieOptions = {
        expires: new Date(Date.now() ), 
        httpOnly: true, // cookie cannot be accessed or modified in any way by the browser,
        sameSite : 'None', // cross-site request forgery (CSRF) protection
        secure : process.env.NODE_ENV === 'production' ? true : false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }
    res.cookie('token', token, cookieOptions);
    return token;
}