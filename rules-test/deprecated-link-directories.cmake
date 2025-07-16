# Test file for deprecated-link-directories rule

cmake_minimum_required(VERSION 3.10)
project(TestProject)

# This should trigger the rule - deprecated usage
link_directories(/usr/local/lib)
link_directories(${CMAKE_BINARY_DIR}/lib)

# This should NOT trigger the rule - preferred approach
add_library(mylib SHARED src/mylib.cpp)
target_link_libraries(mylib PRIVATE /usr/local/lib/libfoo.so)
target_link_libraries(mylib PRIVATE ${CMAKE_BINARY_DIR}/lib/libbar.a)

# Another case that should trigger the rule
link_directories(
    /opt/lib
    /usr/lib64
)

# Good practices that should NOT trigger
find_library(FOO_LIB foo PATHS /usr/local/lib)
target_link_libraries(mylib PRIVATE ${FOO_LIB})
