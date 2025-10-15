// android/app/src/main/java/com/callerdesk/SimLogsPackage.kt
package com.callerdesk

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import java.util.Collections

class SimLogsPackage : ReactPackage {

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules = kotlin.collections.mutableListOf<NativeModule>()
        modules.add(SimLogsModule(reactContext)) // Add your module to the list
        return modules
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return Collections.emptyList() // Return an empty list as you are not creating any UI components
    }
}
