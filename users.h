#include <string>

class user {
    public:
        int userid;
        std::string username;
        std::string password; 
}


class patient : user
{
    public:
        bool gender;        //T, 1=male, F,0=Female
        std::string name;   //FirstName LastName
        std::string dob;    //MM/DD/YY
}

class staff : user
{}

class admin : user
{}