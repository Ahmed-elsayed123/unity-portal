import React from 'react';
import { 
  Users, 
  Award, 
  Target,
  Lightbulb,
  Shield,
  Heart,
  Globe,
  CheckCircle
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for academic excellence in all our programs and maintain the highest standards of education.'
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'We uphold the highest ethical standards and promote honesty, transparency, and accountability.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace innovation and cutting-edge technology to enhance learning experiences.'
    },
    {
      icon: Globe,
      title: 'Diversity',
      description: 'We celebrate diversity and create an inclusive environment for all students and staff.'
    }
  ];

  const achievements = [
    { year: '1999', title: 'University Founded', description: 'Unity University was established with a vision to provide quality education.' },
    { year: '2005', title: 'First Graduation', description: 'Celebrated our first graduating class with 200 students.' },
    { year: '2010', title: 'International Recognition', description: 'Received international accreditation for our engineering programs.' },
    { year: '2015', title: 'Digital Transformation', description: 'Launched our comprehensive online portal system.' },
    { year: '2020', title: 'Remote Learning', description: 'Successfully transitioned to hybrid learning during the pandemic.' },
    { year: '2024', title: '15,000+ Students', description: 'Now serving over 15,000 students across multiple campuses.' }
  ];

  const leadership = [
    {
      name: 'Dr. Sarah Williams',
      position: 'President',
      image: '/api/placeholder/200/200',
      bio: 'Dr. Williams has over 20 years of experience in higher education and has led Unity University to new heights of academic excellence.'
    },
    {
      name: 'Prof. Michael Chen',
      position: 'Vice President of Academic Affairs',
      image: '/api/placeholder/200/200',
      bio: 'Prof. Chen oversees all academic programs and ensures the highest quality of education across all departments.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      position: 'Dean of Students',
      image: '/api/placeholder/200/200',
      bio: 'Dr. Rodriguez is responsible for student services and ensuring a positive learning environment for all students.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Unity University
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Empowering minds, shaping futures through innovative education and comprehensive student support
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To provide accessible, high-quality education that prepares students for success in their chosen fields while fostering critical thinking, creativity, and leadership skills.
              </p>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-primary-600" />
                <span className="text-gray-700">Academic Excellence</span>
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <CheckCircle className="h-6 w-6 text-primary-600" />
                <span className="text-gray-700">Student-Centered Learning</span>
              </div>
              <div className="flex items-center space-x-3 mt-3">
                <CheckCircle className="h-6 w-6 text-primary-600" />
                <span className="text-gray-700">Innovation & Technology</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                To be a leading institution of higher learning that transforms lives and communities through education, research, and service to society.
              </p>
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-800 mb-3">Core Values</h3>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-primary-600" />
                    <span className="text-gray-700">Excellence in all endeavors</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary-600" />
                    <span className="text-gray-700">Integrity and honesty</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-primary-600" />
                    <span className="text-gray-700">Diversity and inclusion</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-primary-600" />
                    <span className="text-gray-700">Service to community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our university's history
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-primary-600 font-bold text-lg mb-2">
                        {achievement.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-primary-600 rounded-full border-4 border-white shadow-md z-10"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600">
              Meet the leaders who guide our university
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {leader.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {leader.position}
                </p>
                <p className="text-gray-600 text-sm">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-primary-100">
              Our impact in numbers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-primary-100">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Faculty Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-primary-100">Academic Programs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
