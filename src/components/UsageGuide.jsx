import { Plus, Play, Coffee, RotateCcw, CheckCircle, Target } from 'lucide-react';

export default function UsageGuide() {
  return (
    <div className="bg-white border-t-4 border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* What is TimeFocus Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            An online Pomodoro Timer to boost your productivity
          </h2>
        </div>

        {/* What is Pomofocus Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="mr-3 text-red-500" size={24} />
            What is TimeFocus?
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-gray-800 leading-relaxed font-medium">
              TimeFocus is a customizable pomodoro timer that works on desktop & 
              mobile browser. The aim of this app is to help you focus on any task you 
              are working on, such as study, writing, or coding. This app is inspired by{' '}
              <span className="text-red-600 font-bold">Pomodoro Technique</span>{' '}
              which is a time management method developed by Francesco Cirillo.
            </p>
          </div>
        </div>

        {/* What is Pomodoro Technique Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            What is Pomodoro Technique?
          </h3>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-gray-800 leading-relaxed mb-4 font-medium">
              The Pomodoro Technique is created by Francesco Cirillo for a more 
              productive way to work and study. The technique uses a timer to break 
              down work into intervals, traditionally 25 minutes in length, separated by 
              short breaks. Each interval is known as a pomodoro, from the Italian word 
              for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a 
              university student.
            </p>
            <div className="text-red-600 text-sm font-bold">
              - Wikipedia
            </div>
          </div>
        </div>

        {/* How to use the Pomodoro Timer Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            How to use the Pomodoro Timer?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  1
                </div>
                <Plus className="text-blue-500" size={20} />
              </div>
              <h4 className="text-gray-900 font-bold mb-2">Add tasks</h4>
              <p className="text-gray-700 text-sm font-medium">to work on today</p>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  2
                </div>
                <Target className="text-emerald-500" size={20} />
              </div>
              <h4 className="text-gray-900 font-bold mb-2">Set estimate pomodoros</h4>
              <p className="text-gray-700 text-sm font-medium">(1 = 25min of work) for each tasks</p>
            </div>

            {/* Step 3 */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  3
                </div>
                <CheckCircle className="text-purple-500" size={20} />
              </div>
              <h4 className="text-gray-900 font-bold mb-2">Select a task</h4>
              <p className="text-gray-700 text-sm font-medium">to work on</p>
            </div>

            {/* Step 4 */}
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  4
                </div>
                <Play className="text-orange-500" size={20} />
              </div>
              <h4 className="text-gray-900 font-bold mb-2">Start timer</h4>
              <p className="text-gray-700 text-sm font-medium">and focus on the task for 25 minutes</p>
            </div>

            {/* Step 5 */}
            <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  5
                </div>
                <Coffee className="text-cyan-500" size={20} />
              </div>
              <h4 className="text-gray-900 font-bold mb-2">Take a break</h4>
              <p className="text-gray-700 text-sm font-medium">for 5 minutes when the alarm ring</p>
            </div>

            {/* Step 6 */}
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  6
                </div>
                <RotateCcw className="text-indigo-500" size={20} />
              </div>
              <h4 className="text-gray-900 font-bold mb-2">Iterate</h4>
              <p className="text-gray-700 text-sm font-medium">3-5 until you finish the tasks</p>
            </div>
          </div>
        </div>

        {/* Basic Features Section */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Basic Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-gray-900 font-bold mb-2">Estimate Finish Time:</h4>
                  <p className="text-gray-700 text-sm font-medium">
                    Get an estimate of the time required to complete your daily tasks.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-gray-900 font-bold mb-2">Add Templates:</h4>
                  <p className="text-gray-700 text-sm font-medium">
                    Save your repetitive tasks as templates and add them quickly.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-gray-900 font-bold mb-2">Visual Reports:</h4>
                  <p className="text-gray-700 text-sm font-medium">
                    See your progress and productivity trends with visual analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-gray-900 font-bold mb-2">Custom Settings:</h4>
                  <p className="text-gray-700 text-sm font-medium">
                    Customize timer durations, colors, sounds, and notifications.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}