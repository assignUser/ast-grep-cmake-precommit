# CMake Best Practices

This document outlines best practices for modern CMake (version >= 3.15) with concrete code examples. These practices focus on maintainable, target-based CMake that can be effectively linted and analyzed.

## Table of Contents

- [General Principles](#general-principles)
- [Variable Usage Guidelines](#variable-usage-guidelines)
- [Target-Based Approach](#target-based-approach)
- [Linking and Dependencies](#linking-and-dependencies)
- [Project Structure](#project-structure)
- [Additional Best Practices](#additional-best-practices)
- [References](#references)

## General Principles

### Use Target-Based CMake

Modern CMake is target-based. Everything should revolve around targets (executables, libraries) rather than directory-based or variable-based approaches.

**✅ Good:**
```cmake
# Define targets and set properties on them
add_library(mylib src/mylib.cpp)
target_include_directories(mylib PUBLIC include)
target_compile_features(mylib PUBLIC cxx_std_17)
```

**❌ Bad:**
```cmake
# Directory-wide settings affect everything
include_directories(include)
set(CMAKE_CXX_STANDARD 17)
add_library(mylib src/mylib.cpp)
```

## Variable Usage Guidelines

### Minimize Variable Usage in General CMake Code

Variables should be used sparingly in general CMake code. They are appropriate in functions and macros but should be avoided for collecting target properties.

**✅ Good:**
```cmake
# Direct specification of sources
add_library(connector 
    src/connection.cpp
    src/protocol.cpp
    src/handler.cpp
)

# Or using GLOB_RECURSE when appropriate
file(GLOB_RECURSE CONNECTOR_SOURCES "src/*.cpp")
add_library(connector ${CONNECTOR_SOURCES})
```

**❌ Bad:**
```cmake
# Using variables unnecessarily
set(CONNECTOR_SRCS 
    src/connection.cpp
    src/protocol.cpp
    src/handler.cpp
)
add_library(connector ${CONNECTOR_SRCS})
```

### Don't Use Variables in Place of Targets

Avoid using variables to represent targets or collect properties that should be attached to targets.

**✅ Good:**
```cmake
add_library(math_utils src/math.cpp)
add_library(string_utils src/string.cpp)

add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE math_utils string_utils)
```

**❌ Bad:**
```cmake
set(MATH_LIB math_utils)
set(STRING_LIB string_utils)
set(ALL_LIBS ${MATH_LIB} ${STRING_LIB})

add_executable(myapp src/main.cpp)
target_link_libraries(myapp PRIVATE ${ALL_LIBS})
```

## Target-Based Approach

### Define Properties on Targets

Set all compilation and linking properties directly on targets using target-specific commands.

**✅ Good:**
```cmake
add_library(mylib src/lib.cpp)

# Set properties specifically for this target
target_include_directories(mylib 
    PUBLIC include
    PRIVATE src/internal
)

target_compile_definitions(mylib 
    PUBLIC MYLIB_API_VERSION=2
    PRIVATE MYLIB_INTERNAL_DEBUG
)

target_compile_options(mylib PRIVATE 
    $<$<CXX_COMPILER_ID:GNU>:-Wall -Wextra>
    $<$<CXX_COMPILER_ID:MSVC>:/W4>
)
```

**❌ Bad:**
```cmake
# Global settings affect all subsequent targets
include_directories(include src/internal)
add_definitions(-DMYLIB_API_VERSION=2 -DMYLIB_INTERNAL_DEBUG)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")

add_library(mylib src/lib.cpp)
```

### Use Generator Expressions

Leverage generator expressions for conditional compilation and platform-specific settings.

**✅ Good:**
```cmake
target_compile_definitions(mylib PRIVATE
    $<$<CONFIG:Debug>:DEBUG_MODE>
    $<$<PLATFORM_ID:Windows>:WINDOWS_BUILD>
    $<$<CXX_COMPILER_ID:MSVC>:MSVC_COMPILER>
)

target_link_libraries(mylib PUBLIC
    $<$<PLATFORM_ID:Linux>:pthread>
    $<$<PLATFORM_ID:Windows>:ws2_32>
)
```

**❌ Bad:**
```cmake
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    add_definitions(-DDEBUG_MODE)
endif()

if(WIN32)
    add_definitions(-DWINDOWS_BUILD)
    target_link_libraries(mylib ws2_32)
elseif(UNIX)
    target_link_libraries(mylib pthread)
endif()
```

## Linking and Dependencies

### Always Use Proper Linking Scopes

Use PRIVATE, PUBLIC, and INTERFACE scopes appropriately to improve compile times and dependency resolution.

**✅ Good:**
```cmake
add_library(core src/core.cpp)
add_library(utils src/utils.cpp)
add_library(mylib src/mylib.cpp)

# Core is used internally by mylib, not exposed to consumers
target_link_libraries(mylib PRIVATE core)

# Utils is both used by mylib and exposed to consumers
target_link_libraries(mylib PUBLIC utils)

# Headers-only dependency exposed to consumers
target_link_libraries(mylib INTERFACE header_only_lib)
```

**❌ Bad:**
```cmake
# Using PUBLIC for everything (over-linking)
target_link_libraries(mylib PUBLIC core utils header_only_lib)

# Or omitting scope entirely (defaults to PUBLIC)
target_link_libraries(mylib core utils header_only_lib)
```

### Scope Guidelines

- **PRIVATE**: Dependency is used by the target but not exposed to consumers
- **PUBLIC**: Dependency is used by the target AND exposed to consumers  
- **INTERFACE**: Dependency is not used by the target but is exposed to consumers (e.g., header-only libs)

**✅ Good:**
```cmake
# Library implementation
add_library(json_parser src/parser.cpp)

# Private dependencies (implementation details)
target_link_libraries(json_parser PRIVATE 
    internal_string_utils
    platform_specific_libs
)

# Public dependencies (part of the API)
target_link_libraries(json_parser PUBLIC 
    json_types  # Used in public headers
)

# Interface dependencies (header-only, passed to consumers)
target_link_libraries(json_parser INTERFACE 
    header_only_json_traits
)
```

### Avoid Transitive Dependencies

Don't rely on transitive dependencies in your code. Always link directly to what you use.

**✅ Good:**
```cmake
add_executable(myapp src/main.cpp)

# Explicitly link to everything we use
target_link_libraries(myapp PRIVATE
    my_core_lib      # We use this directly
    logging_lib      # We use this directly  
    config_parser    # We use this directly
)
```

**❌ Bad:**
```cmake
add_executable(myapp src/main.cpp)

# Only linking to core_lib but relying on it to transitively 
# provide logging_lib and config_parser
target_link_libraries(myapp PRIVATE my_core_lib)
```

## Project Structure

### Use Consistent Directory Structure

Organize your project with a clear, consistent structure.

**✅ Good:**
```
project/
├── CMakeLists.txt
├── include/
│   └── myproject/
│       ├── core.h
│       └── utils.h
├── src/
│   ├── core.cpp
│   └── utils.cpp
├── tests/
│   ├── CMakeLists.txt
│   └── test_core.cpp
└── examples/
    ├── CMakeLists.txt
    └── example1.cpp
```

```cmake
# Root CMakeLists.txt
cmake_minimum_required(VERSION 3.15)
project(myproject VERSION 1.0.0)

add_subdirectory(src)
if(BUILD_TESTING)
    add_subdirectory(tests)
endif()
if(BUILD_EXAMPLES)
    add_subdirectory(examples)
endif()
```

### Proper Include Directory Handling

Use target-specific include directories with appropriate scopes.

**✅ Good:**
```cmake
add_library(mylib 
    src/implementation.cpp
    src/internal.cpp
)

target_include_directories(mylib
    PUBLIC 
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
        $<INSTALL_INTERFACE:include>
    PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}/src
)
```

**❌ Bad:**
```cmake
# Global include affects all targets
include_directories(include src)

add_library(mylib 
    src/implementation.cpp
    src/internal.cpp
)
```

## Additional Best Practices

### Use find_package Instead of Manual Finding

Prefer `find_package` over manual library finding.

**✅ Good:**
```cmake
find_package(Boost 1.70 REQUIRED COMPONENTS system filesystem)
target_link_libraries(myapp PRIVATE Boost::system Boost::filesystem)

find_package(OpenSSL REQUIRED)
target_link_libraries(myapp PRIVATE OpenSSL::SSL OpenSSL::Crypto)
```

**❌ Bad:**
```cmake
find_path(BOOST_INCLUDE_DIR boost/version.hpp)
find_library(BOOST_SYSTEM_LIB boost_system)
find_library(BOOST_FILESYSTEM_LIB boost_filesystem)

target_include_directories(myapp PRIVATE ${BOOST_INCLUDE_DIR})
target_link_libraries(myapp PRIVATE ${BOOST_SYSTEM_LIB} ${BOOST_FILESYSTEM_LIB})
```

### Set Minimum CMake Version Appropriately

Always specify a minimum CMake version that supports the features you use.

**✅ Good:**
```cmake
# For modern CMake features
cmake_minimum_required(VERSION 3.15)

# For specific feature requirements
cmake_minimum_required(VERSION 3.20)  # For CMAKE_CXX_STANDARD 23
```

### Use target_compile_features Instead of CMAKE_CXX_STANDARD

Specify C++ standard requirements on targets rather than globally.

**✅ Good:**
```cmake
add_library(mylib src/lib.cpp)
target_compile_features(mylib PUBLIC cxx_std_17)

add_executable(myapp src/main.cpp)  
target_compile_features(myapp PRIVATE cxx_std_20)
```

**❌ Bad:**
```cmake
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_library(mylib src/lib.cpp)
add_executable(myapp src/main.cpp)
```

### Prefer target_sources for Complex Targets

For targets with many sources or conditional sources, use `target_sources`.

**✅ Good:**
```cmake
add_library(platform_lib)

target_sources(platform_lib PRIVATE
    src/common.cpp
    src/base.cpp
)

if(WIN32)
    target_sources(platform_lib PRIVATE src/windows.cpp)
elseif(UNIX)
    target_sources(platform_lib PRIVATE src/unix.cpp)
endif()
```

### Use Modern Testing Integration

Integrate testing properly with CTest.

**✅ Good:**
```cmake
# In root CMakeLists.txt
include(CTest)
if(BUILD_TESTING)
    add_subdirectory(tests)
endif()

# In tests/CMakeLists.txt
find_package(GTest REQUIRED)

add_executable(unit_tests test_main.cpp test_core.cpp)
target_link_libraries(unit_tests PRIVATE 
    mylib
    GTest::gtest
    GTest::gtest_main
)

include(GoogleTest)
gtest_discover_tests(unit_tests)
```

### Handle Options and Configuration Properly

Use proper option handling and configuration.

**✅ Good:**
```cmake
option(BUILD_SHARED_LIBS "Build shared libraries" OFF)
option(BUILD_TESTS "Build tests" OFF)
option(ENABLE_WARNINGS "Enable compiler warnings" ON)

if(ENABLE_WARNINGS)
    add_library(compiler_warnings INTERFACE)
    target_compile_options(compiler_warnings INTERFACE
        $<$<CXX_COMPILER_ID:GNU>:-Wall -Wextra -Wpedantic>
        $<$<CXX_COMPILER_ID:MSVC>:/W4>
    )
endif()
```

## References

This document is based on modern CMake best practices from:

- [Awesome CMake](https://github.com/onqtam/awesome-cmake)
- [CMake Cookbook](https://github.com/dev-cafe/cmake-cookbook)  
- [Modern CMake Guide](https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1)
- [CppCon 2017: Using Modern CMake Patterns](https://github.com/CppCon/CppCon2017/blob/master/Tutorials/Using%20Modern%20CMake%20Patterns%20to%20Enforce%20a%20Good%20Modular%20Design/Using%20Modern%20CMake%20Patterns%20to%20Enforce%20a%20Good%20Modular%20Design%20-%20Mathieu%20Ropert%20-%20CppCon%202017.pdf)
- [CMake Documentation](https://cmake.org/documentation/)
- [Effective Modern CMake](https://gist.github.com/mbinna/c61dbb39bca0e4fb7d1f73b0d66a4fd1)

---

*This documentation focuses on practices that can be effectively detected and enforced through static analysis and linting tools.*